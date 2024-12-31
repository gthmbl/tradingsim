import React from "react";

const StockInformation = ({
  searchedStock,
  quantity,
  setQuantity,
  handleBuyStock,
}) => (
  <div style={{ marginTop: "20px" }}>
    <h3>Stock Information</h3>
    <p>
      <strong>Symbol:</strong> {searchedStock.symbol}
    </p>
    <p>
      <strong>Name:</strong> {searchedStock.name}
    </p>
    <p>
      <strong>Price:</strong> ${searchedStock.price.toFixed(2)}
    </p>
    <div>
      <label>
        Quantity:{" "}
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </label>
      <button
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
