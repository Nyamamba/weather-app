import { useEffect } from "react";
import { useSubscription } from "../SubscriptionContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Message = ({ city, rainData }) => {
  const { subscribedCities, email: userEmail } = useSubscription();

  useEffect(() => {
    if (!city || !rainData || rainData.length === 0) return;

    // Check if the city is subscribed
    if (!subscribedCities.includes(city)) return;

    // Group rain events by city
    const rainByCity = rainData.reduce((acc, rainEvent) => {
      if (!acc[city]) {
        acc[city] = [];
      }
      acc[city].push(rainEvent);
      return acc;
    }, {});

    // Send a single email for the city with all rain events
    sendRainAlert(city, rainByCity[city]);
  }, [city, rainData, subscribedCities, userEmail]);

  const sendRainAlert = async (city, rainEvents) => {
    if (!userEmail) {
      console.error("User email not found!");
      return;
    }

    try {
      console.log("Sending request with:", {
        email: userEmail,
        rainAlerts: rainEvents,
      }); // Log the request payload

      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          rainAlerts: rainEvents.map((event) => ({ ...event, city })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send alert");
      }

      toast.success(
        `🌧️ Rain detected in ${city} at multiple times. Alert sent!`
      );
    } catch (error) {
      console.error("Error sending rain alert:", error);
      toast.error("❌ Failed to send rain alert. Please try again.");
    }
  };

  return null;
};

export default Message;
