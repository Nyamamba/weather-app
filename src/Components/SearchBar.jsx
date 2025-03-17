import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./search.css"
const SearchBar = ({ setCity }) => {
  const [inputCity, setInputCity] = useState("");

  const handleSearch = () => {
    if (inputCity.trim()) {
      setCity(inputCity.trim()); // Fix: Trim input before setting
      setInputCity(""); // Clear input after search
    }
  };

  return (
    <section className="search">
      <input
        type="text"
        placeholder="Enter city..."
        value={inputCity}
        onChange={(e) => setInputCity(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <FontAwesomeIcon
        className="icon"
        icon={faMagnifyingGlass}
        style={{ color: "white", fontSize: "14px", cursor: "pointer" }}
        onClick={handleSearch}
      />
    </section>
  );
};

export default SearchBar;
