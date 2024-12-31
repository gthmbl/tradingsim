export const calculatePriceChange = (currentPrice, averagePrice) => {
    if (!averagePrice || averagePrice === 0) return "N/A";
    return (((currentPrice - averagePrice) / averagePrice) * 100).toFixed(2);
  };
  
  export const calculateUnrealizedPnL = (averagePrice, quantity, currentPrice) => {
    if (!averagePrice || averagePrice <= 0 || !quantity || quantity <= 0) return 0;
    return (currentPrice - averagePrice) * quantity;
};

  
  // Format numbers into currency
  export const formatCurrency = (value) => {
    if (typeof value !== "number" || isNaN(value) || value <= 0) return "N/A";
    return `$${value.toFixed(2)}`;
  };
  
  
  // Get color based on profit or loss
  export const getTextColor = (isProfit) => (isProfit ? "#66bb6a" : "#ff7043");
  