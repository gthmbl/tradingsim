import React from "react";
import "../ButtonStyles.css";

const SellStockRow = ({
  quantity,
  sellQuantity,
  setSellQuantity,
  handleSellStock,
  selectedStock,
}) => (
  <tr>
    <td colSpan="7">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
          className={`button button-danger`}
          onClick={handleSellStock}
          disabled={sellQuantity < 1 || sellQuantity > selectedStock.quantity}
        >
          Sell
        </button>
      </div>
    </td>
  </tr>
);

export default SellStockRow;
