const TopPerformingStocks = ({ performingStocks = [], error }) => {
    console.log("Performing Stocks:", performingStocks); // Log for debugging
    return (
      <div className="top-performing-stocks">
        <h3>Top Performing Stocks</h3>
        {error ? (
          <p>{error}</p>
        ) : performingStocks.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>% Change</th>
              </tr>
            </thead>
            <tbody>
              {performingStocks.map((stock, index) => (
                <tr key={index}>
                  <td>{stock.symbol}</td>
                  <td>{stock.longName}</td>
                  <td>${stock.regularMarketPrice.toFixed(2)}</td>
                  <td>{stock.regularMarketChangePercent.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading top performing stocks...</p>
        )}
      </div>
    );
  };
  
  export default TopPerformingStocks;
