import React, { useState, useEffect, useCallback } from "react";
import AccountBalance from "./components/AccountBalance";
import SearchBar from "./components/SearchBar";
import StockInformation from "./components/StockInformation";
import PortfolioTable from "./components/PortfolioTable";
import TradeHistory from "./components/TradeHistory";
import {
  calculateUnrealizedPnL,
  calculatePriceChange,
  formatCurrency,
} from "./utils/calculate";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTradeHistory, setShowTradeHistory] = useState(false);
  const [searchSymbol, setSearchSymbol] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchedStock, setSearchedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [balance, setBalance] = useState(0);

  // Fetch portfolio
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch portfolio.");
      }

      const { portfolio, balance } = await response.json();
      setPortfolio(portfolio);
      setBalance(Number(balance));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch autocomplete suggestions
  const fetchAutocompleteSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/autocomplete?query=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch autocomplete suggestions.");
      }

      const data = await response.json();
      const suggestionList = data.quotes.map((quote) => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname || "Unknown Name",
      }));
      setSuggestions(suggestionList);
    } catch (err) {
      console.error(err.message);
      setSuggestions([]);
    }
  };

  // Fetch trade history
  const fetchTradeHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/trade-history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trade history.");
      }

      const history = await response.json();
      setTradeHistory(history);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  // Fetch stock details
  const fetchStockBySymbol = async () => {
    if (!searchSymbol.trim()) {
      alert("Please enter a valid stock symbol.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const stockResponse = await fetch(
        `http://localhost:3000/api/stocks?symbols=${searchSymbol.trim().toUpperCase()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!stockResponse.ok) {
        throw new Error("Stock not found.");
      }

      const stockData = await stockResponse.json();
      const stock = stockData[0]; // Assume single result

      setSearchedStock(stock);
    } catch (err) {
      alert(err.message);
      setSearchedStock(null);
    }
  };

  // Handle buying stock
  const handleBuyStock = async (symbol, quantity, price) => {
    if (!symbol || quantity < 1) {
      alert("Invalid stock or quantity.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/buy-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stockSymbol: symbol, quantity, price }),
      });

      if (!response.ok) {
        throw new Error("Failed to buy stock.");
      }

      const { newBalance } = await response.json();
      setBalance(newBalance);
      fetchPortfolio();
      fetchTradeHistory();
      alert(`Bought ${quantity} shares of ${symbol}.`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle selling stock
  const handleSellStock = async () => {
    if (!selectedStock || sellQuantity < 1) {
      alert("Invalid stock or quantity.");
      return;
    }

    if (sellQuantity > selectedStock.quantity) {
      alert(`You cannot sell more than ${selectedStock.quantity} shares.`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/sell-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stockSymbol: selectedStock.stock_symbol,
          quantity: sellQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sell stock.");
      }

      const { newBalance } = await response.json();
      setBalance(newBalance);
      fetchPortfolio();
      fetchTradeHistory();
      alert(`Sold ${sellQuantity} shares of ${selectedStock.stock_symbol}.`);
      setSelectedStock(null);
      setSellQuantity(1);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchTradeHistory();
  }, [fetchTradeHistory]);

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Portfolio</h2>
      <AccountBalance balance={balance} />
      <SearchBar
        searchSymbol={searchSymbol}
        setSearchSymbol={(value) => {
          setSearchSymbol(value);
          fetchAutocompleteSuggestions(value);
        }}
        fetchStockBySymbol={fetchStockBySymbol}
        suggestions={suggestions}
        handleSuggestionClick={(symbol) => {
          setSearchSymbol(symbol);
          setSuggestions([]);
        }}
      />

      {searchedStock && (
        <StockInformation
          searchedStock={searchedStock}
          quantity={quantity}
          setQuantity={setQuantity}
          handleBuyStock={handleBuyStock}
        />
      )}

      <PortfolioTable
        portfolio={portfolio}
        selectedStock={selectedStock}
        setSelectedStock={setSelectedStock}
        sellQuantity={sellQuantity}
        setSellQuantity={setSellQuantity}
        handleSellStock={handleSellStock}
        calculatePriceChange={calculatePriceChange}
        calculateUnrealizedPnL={calculateUnrealizedPnL}
        formatCurrency={formatCurrency}
      />
      <TradeHistory
        tradeHistory={tradeHistory}
        showTradeHistory={showTradeHistory}
        setShowTradeHistory={setShowTradeHistory}
      />
    </div>
  );
};

export default Portfolio;