import React from "react";

const TradeHistory = ({ tradeHistory, showTradeHistory, setShowTradeHistory }) => (
  <div>
    <h2 style={{ marginTop: "40px" }}>
      Trade History
      <button
        onClick={() => setShowTradeHistory((prev) => !prev)}
        style={{
          marginLeft: "10px",
          padding: "5px 10px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {showTradeHistory ? "Hide" : "Show"}
      </button>
    </h2>
    {showTradeHistory && (
      <table style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Stock Symbol</th>
            <th>Trade Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Trade Date</th>
          </tr>
        </thead>
        <tbody>
          {tradeHistory.length > 0 ? (
            tradeHistory.map((trade, index) => (
              <tr key={`${trade.stock_symbol}-${index}`}>
                <td>{trade.stock_symbol}</td>
                <td>{trade.trade_type}</td>
                <td>{trade.quantity}</td>
                <td>${parseFloat(trade.price).toFixed(2)}</td>
                <td>{new Date(trade.trade_date).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No trade history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>
);

export default TradeHistory;