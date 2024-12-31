import React from "react";

const AuthForm = ({
  isRegistering,
  email,
  password,
  username,
  setEmail,
  setPassword,
  setUsername,
  onSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit}>
      {isRegistering && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ marginBottom: "10px" }}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ marginBottom: "10px" }}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : isRegistering ? "Register" : "Login"}
      </button>
    </form>
  );
};

export default AuthForm;
