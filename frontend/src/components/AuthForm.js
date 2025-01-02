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
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          style={{ marginBottom: "10px" }}
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        style={{ marginBottom: "10px" }}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete={isRegistering ? "new-password" : "current-password"}
        style={{ marginBottom: "10px" }}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : isRegistering ? "Register" : "Login"}
      </button>
    </form>
  );
};

export default AuthForm;
