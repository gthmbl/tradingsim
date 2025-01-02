import React from "react";

const Header = ({ portfolioName = "Portfolio", accountBalance = 0, onLogout }) => {
  
  const numericBalance = parseFloat(accountBalance) || 0;

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow-md">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Trading Simulator</h1>
      </div>
      <div className="text-right">
        <h2 className="text-xl font-semibold">{portfolioName || "Portfolio"}</h2>
        <p className="text-gray-600">
          Account Balance:{" "}
          <span className="font-bold text-green-500">${numericBalance.toFixed(2)}</span>
        </p>
      </div>
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;