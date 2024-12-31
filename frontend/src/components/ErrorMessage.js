import React from "react";

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <p style={{ color: "red" }}>{message}</p>;
};

export default ErrorMessage;
