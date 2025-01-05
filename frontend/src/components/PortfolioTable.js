import React from "react";
import SellStockRow from "./SellStockRow";
import {
  formatCurrency,
  getTextColor,
  calculatePriceChange,
  calculateUnrealizedPnL,
} from "../utils/calculate";

const PortfolioTable = ({
  portfolio,
  selectedStock,
  setSelectedStock,
  sellQuantity,
  setSellQuantity,
  handleSellStock,
}) => (
  <table style={{ marginTop: "20px" }}>
    <thead>
      <tr>
        <th>Stock Symbol</th>
        <th>Quantity</th>
        <th>Average Price</th>
        <th>Current Price</th>
        <th>Price Change </th>
        <th>Unrealized Profit/Loss</th>
      </tr>
    </thead>
    <tbody>
      {portfolio.map((item) => {
        const currentPrice = item.current_price || 0;
        const averagePrice = item.average_price || 0;
        const quantity = item.quantity || 0;

        const priceChange = calculatePriceChange(currentPrice, averagePrice);
        const unrealizedPnL =
          averagePrice > 0 && quantity > 0
            ? calculateUnrealizedPnL(
                averagePrice,
                quantity,
                currentPrice
              ).toFixed(2)
            : "0.00";

        const isProfit = parseFloat(priceChange) >= 0;

        return (
          <React.Fragment key={item.id || item.symbol}>
            <tr
              onClick={() =>
                setSelectedStock(
                  selectedStock?.stock_symbol === item.stock_symbol
                    ? null
                    : item
                )
              }
              className={`portfolio-row ${
                selectedStock?.stock_symbol === item.stock_symbol
                  ? "selected"
                  : ""
              }`}
            >
              <td>{item.stock_symbol || item.symbol}</td>
              <td>{quantity || "N/A"}</td>
              <td>
                {item.average_price > 0
                  ? `$${item.average_price.toFixed(2)}`
                  : "N/A"}
              </td>
              <td>{formatCurrency(currentPrice)}</td>
              <td style={{ color: getTextColor(isProfit), fontWeight: "bold" }}>
                {priceChange !== "NaN" ? `${priceChange}%` : "N/A"}
              </td>
              <td style={{ color: getTextColor(isProfit), fontWeight: "bold" }}>
                {unrealizedPnL !== "NaN" ? `$${unrealizedPnL}` : "$0.00"}
              </td>
              <td>Click to Sell</td>
            </tr>

            {selectedStock?.stock_symbol === item.stock_symbol && (
              <SellStockRow
                quantity={quantity}
                sellQuantity={sellQuantity}
                setSellQuantity={setSellQuantity}
                handleSellStock={handleSellStock}
                selectedStock={selectedStock}
              />
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  </table>
);

export default PortfolioTable;
