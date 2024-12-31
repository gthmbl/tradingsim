import React from "react";

const AccountBalance = ({ balance }) => (
  <div style={{ marginTop: "10px", fontSize: "18px" }}>
    <strong>Account Balance:</strong> ${balance.toFixed(2)}
  </div>
);

export default AccountBalance;
