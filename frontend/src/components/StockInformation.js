import React from "react";
import "../StockInformation.css"; 
import "../ButtonStyles.css"

const StockInformation = ({
  searchedStock,
  quantity,
  setQuantity,
  handleBuyStock,
}) => (
  <div className="card">
    <h3 className="stock-info-title">Stock Information</h3>
    <p className="stock-info-item">
      <strong>Symbol:</strong> {searchedStock.symbol}
    </p>
    <p className="stock-info-item">
      <strong>Name:</strong> {searchedStock.name}
    </p>
    <p className="stock-info-item">
      <strong>Price:</strong> ${searchedStock.price.toFixed(2)}
    </p>
    <div className="stock-info-action">
      <label className="stock-info-label">
        Quantity:{" "}
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="stock-info-input"
        />
      </label>
      <button
        className="button button-primary"
        onClick={() =>
          handleBuyStock(searchedStock.symbol, quantity, searchedStock.price)
        }
      >
        Buy
      </button>
    </div>
  </div>
);

export default StockInformation;
