import React from "react";

export function TopStocksInfo({ stocks }) {
  return (
    <div  className="card">
      <h3 className="top-stocks-title">  Popular Stocks</h3>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td>{stock.symbol}</td>
              <td>{stock.name}</td>
              <td>${stock.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
