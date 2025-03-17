const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

// Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "OPTIONS"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type"], // Allow these headers
  })
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

// make time zones for a user friendly email
const getTimeOfDay = (time) => {
  const hour = parseInt(time.split(":")[0]);
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 24) return "evening";
  return "night";
};

// groups the emails to the same city to prevent many emails from the same city
const groupRainEvents = (rainAlerts) => {
  const groupedAlerts = rainAlerts.reduce((acc, alert) => {
    const date = alert.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(alert);
    return acc;
  }, {});

  return Object.entries(groupedAlerts).map(([date, alerts]) => {
    const timeOfDayGroups = alerts.reduce((acc, alert) => {
      const timeOfDay = getTimeOfDay(alert.time);
      if (!acc[timeOfDay]) {
        acc[timeOfDay] = [];
      }
      acc[timeOfDay].push(alert);
      return acc;
    }, {});

    const timeRanges = Object.entries(timeOfDayGroups).map(
      ([timeOfDay, events]) => {
        const times = events.map((event) => event.time).join(", ");
        return `🌧️ Rain in the ${timeOfDay} (${times})`;
      }
    );

    return {
      date,
      timeRanges, 
    };
  });
};

app.post("/send-email", async (req, res) => {
  const { email, rainAlerts } = req.body;

  if (!email || !rainAlerts || rainAlerts.length === 0) {
    return res.status(400).json({ message: "Invalid request data." });
  }

  // Group rain alerts by city
  const rainByCity = rainAlerts.reduce((acc, alert) => {
    if (!acc[alert.city]) {
      acc[alert.city] = [];
    }
    acc[alert.city].push(alert);
    return acc;
  }, {});

  // Format the email body
  const alertMessages = Object.entries(rainByCity)
    .map(([city, alerts]) => {
      const groupedAlerts = groupRainEvents(alerts);
      const cityAlerts = groupedAlerts
        .map(
          ({ date, timeRanges }) =>
            `📅 ${date}:\n${timeRanges
              .map((range) => `⏰ ${range}`)
              .join("\n")}`
        )
        .join("\n\n");
      return `📍 ${city}:\n${cityAlerts}`;
    })
    .join("\n\n");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🌧️ Weather Alert: Rain Expected!",
    text: `Hello, rain is expected in the following locations:\n\n${alertMessages}\n\nStay prepared!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Email backend running on port ${PORT}`);
});
