import React from "react";

const SellStockRow = ({
  quantity,
  sellQuantity,
  setSellQuantity,
  handleSellStock,
  selectedStock,
}) => (
  <tr>
    <td colSpan="7">
      <div style={{ display: "flex", alignItems: "center" }}>
        <label>
          Quantity to Sell:
          <input
            type="number"
            min="1"
            max={quantity}
            value={sellQuantity}
            onChange={(e) => setSellQuantity(Number(e.target.value))}
            style={{ marginLeft: "10px", width: "80px" }}
          />
        </label>
        <button
  onClick={handleSellStock}
  disabled={sellQuantity < 1 || sellQuantity > selectedStock.quantity}
  style={{
    marginLeft: "10px",
    backgroundColor:
      sellQuantity < 1 || sellQuantity > selectedStock.quantity
        ? "#ccc"
        : "#007bff",
    color: "white",
    cursor:
      sellQuantity < 1 || sellQuantity > selectedStock.quantity
        ? "not-allowed"
        : "pointer",
  }}
>
  Sell
</button>

      </div>
    </td>
  </tr>
);

export default SellStockRow;

