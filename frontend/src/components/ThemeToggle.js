import React, { useState, useEffect } from "react";
import "../ButtonStyles.css"; // Ensure button styles are applied

const ThemeToggle = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => localStorage.getItem("theme") === "dark" // Check saved theme in localStorage
  );

  useEffect(() => {
    const theme = isDarkTheme ? "dark-theme" : "light-theme";
    document.body.className = theme; // Apply theme class to body
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  return (
    <button
      className="button button-secondary"
      onClick={() => setIsDarkTheme((prev) => !prev)}
    >
      {isDarkTheme ? "Light Theme" : "Dark Theme"}
    </button>
  );
};

export default ThemeToggle;
