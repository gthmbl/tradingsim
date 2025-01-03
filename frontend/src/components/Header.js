import React from "react";

const Header = ({ portfolioName = "Portfolio", accountBalance = 0, onLogout }) => {
  const numericBalance = parseFloat(accountBalance) || 0;

  return (
    <div className="header">
      <div className="title">
        <h1>Trading Simulator</h1>
      </div>
      <div className="portfolio-name">
        <h1>{portfolioName}</h1>
      </div>
      <div className="account-info">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
        <h2>Account Balance: ${numericBalance.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default Header;
