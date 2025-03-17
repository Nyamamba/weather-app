import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 1️⃣ Create the Context
const SubscriptionContext = createContext();

// 2️⃣ Create the Provider Component
export const SubscriptionProvider = ({ children }) => {
  const [email, setEmail] = useState(
    () => localStorage.getItem("userEmail") || ""
  );
  const [subscribedCities, setSubscribedCities] = useState(() => {
    return JSON.parse(localStorage.getItem("subscribedCities")) || [];
  });

  // ✅ Debounce localStorage updates to reduce frequent writes
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("userEmail", email);
      localStorage.setItem(
        "subscribedCities",
        JSON.stringify(subscribedCities)
      );
    }, 500); // Delay for efficiency

    return () => clearTimeout(timeout);
  }, [email, subscribedCities]);

  // ✅ Improved toggle function using Set for efficiency
  const toggleSubscription = (validCity) => {
    if (!isValidEmail(email)) {
      return;
    }

    setSubscribedCities((prevCities) => {
      const citySet = new Set(prevCities);
      if (citySet.has(validCity)) {
        citySet.delete(validCity);
      } else {
        citySet.add(validCity);
      }
      return Array.from(citySet);
    });
  };

  // ✅ Email validation function
  const isValidEmail = (email) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email); // Basic regex validation
  };

  // ✅ Ensure email is valid before setting it
  const handleSetEmail = (newEmail) => {
    if (!newEmail) {
      setSubscribedCities([]); // Clear subscriptions if logging out
      localStorage.removeItem("subscribedCities");
      localStorage.removeItem("userEmail");
      setEmail("");
      return;
    }

    if (!isValidEmail(newEmail)) {
      toast.warn("Please enter a valid email before subscribing to a city.");
      return;
    }

    setEmail(newEmail);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        email,
        setEmail: handleSetEmail,
        subscribedCities,
        toggleSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// 3️⃣ Create a Custom Hook for easier access
export const useSubscription = () => useContext(SubscriptionContext);
