# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# weatherApp

# Weather Notification App

## Overview
This application fetches real-time weather data and sends notifications (email alerts) when it detects rain in a subscribed city. The app is built using React (Vite) for the frontend, Node.js (Express) for the backend, and Capacitor for mobile compatibility.

## Tech Stack
- **Frontend:** React (Vite), Capacitor
- **Backend:** Node.js, Express
- **Email Service:** Nodemailer 
- **Mobile App Support:** Capacitor for Android

## Installation & Setup
### Prerequisites
- Node.js and Yarn installed
- Capacitor installed (`npm install -g @capacitor/cli`)
- Android Studio (for testing Android app)

### Steps to Run
1. **Clone the Repository:**
   ```sh
   git clone <repository-url>
   cd weatherApp
   ```

2. **Install Dependencies:**
   ```sh
   yarn install
   ```

3. **Set Up Environment Variables:**
   - Update the `.env` file in the backend folder with required API keys ( email service credentials which is the password and email itself).
   - In WeatherFetch.jsx update with your API key

4. **Run the Backend:**
   ```sh
   cd backend
   yarn start
   ```

5. **Run the Frontend:**
   ```sh
   cd frontend
   yarn dev
   ```

6. **Run on Android (Capacitor)**
   - Initialize Capacitor:
     ```sh
     npx cap init
     ```
   - Add Android platform:
     ```sh
     npx cap add android
     ```
   - Sync project:
     ```sh
     npx cap sync
     ```
   - Open in Android Studio:
     ```sh
     npx cap open android
     ```

### Note on Android Studio
Currently, Android Studio is not fully configured on this system, but all Capacitor commands have been executed successfully. The app should work once properly opened and built in Android Studio.

### Note on the App
App can run smoothly on Browser
Run
 ``` yarn start or yarn run dev```

## API Documentation
### Weather Fetching API
- **Endpoint:** `/api/weather`
- **Method:** `GET`
- **Response:** JSON with weather conditions

### Email Notification API
- **Endpoint:** `/api/send-email`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "rainAlerts": [{ "city": "Nairobi", "time": "14:00", "date": "2025-02-27" }]
  }
  ```
- **Response:** `200 OK` if email is sent successfully

## Challenges Faced & Learnings
- Faced issues with Android Studio installation, but the Capacitor setup is complete.
- Learned how to integrate RESTful services and email notifications effectively.
- Used Vite and Yarn for optimized frontend development.

---


# weather-app
# weather-app
