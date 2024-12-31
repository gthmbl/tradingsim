import React from "react";

const BuyStocksModal = ({
  searchedStock,
  quantity,
  setQuantity,
  handleBuyStock,
  onClose,
}) => {
  if (!searchedStock) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2>Buy Stock</h2>
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
              style={{ width: "60px", marginLeft: "10px" }}
            />
          </label>
        </div>
        <button onClick={handleBuyStock} style={{ marginTop: "10px" }}>
          Confirm Buy
        </button>
        <button onClick={onClose} style={{ marginTop: "10px", marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BuyStocksModal;
