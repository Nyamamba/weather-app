import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons"; // Import the bell icon
import { useSubscription } from "./SubscriptionContext";

const NotificationBell = ({ validCity }) => {
  const { email, setEmail, subscribedCities, toggleSubscription } =
    useSubscription();

  const isSubscribed = subscribedCities.includes(validCity);

  const handleSubscribe = () => {
    if (!email) {
      const userEmail = prompt("Please enter your email address: ");
      if (!userEmail) return;
      setEmail(userEmail);
    }

    toggleSubscription(validCity); // Update the subscription status in the SubscriptionContext
  };
  return (
    <section>
      <FontAwesomeIcon
        icon={isSubscribed ? faBell : faBellSlash}
        style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
        onClick={handleSubscribe}
      />
    </section>
  );
};

export default NotificationBell;
