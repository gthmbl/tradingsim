export function TopStocksInfo({ stocks }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Price</th>
          <th>Currency</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => (
          <tr key={stock.symbol}>
            <td>{stock.symbol}</td>
            <td>{stock.name}</td>
            <td>${stock.price.toFixed(2)}</td>
            <td>{stock.currency}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
