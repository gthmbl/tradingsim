import React, { useState } from "react";
import AuthForm from "./components/AuthForm";
import ErrorMessage from "./components/ErrorMessage";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Save token to localStorage
      setUsername(data.username || ""); // Safely set username
      onLoginSuccess({
        username: data.username || "", // Pass username safely
        balance: data.balance || 0, // Pass balance safely
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      setError("All fields are required");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      await response.json();
      alert("Registration successful!");
      setIsRegistering(false); // Switch back to login form
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = isRegistering ? handleRegister : handleLogin;

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h1>{isRegistering ? "Register" : "Login"}</h1>
      <AuthForm
        isRegistering={isRegistering}
        email={email}
        password={password}
        username={username}
        setEmail={setEmail}
        setPassword={setPassword}
        setUsername={setUsername}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <ErrorMessage message={error} />
      <button
        onClick={() => {
          setIsRegistering(!isRegistering);
          setError(null);
        }}
        style={{ marginTop: "10px" }}
      >
        {isRegistering ? "Switch to Login" : "Switch to Register"}
      </button>
    </div>
  );
};

export default Login;
