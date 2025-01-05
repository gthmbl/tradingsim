import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import SearchBar from "./SearchBar";
import StockInformation from "./StockInformation";
import PortfolioTable from "./PortfolioTable";
import TradeHistory from "./TradeHistory";
import {
  calculateUnrealizedPnL,
  calculatePriceChange,
  formatCurrency,
} from "../utils/calculate";
import { TopStocksInfo } from "./TopStocksInfo";
import TopPerformingStocks from "./TopPerformingStocks";

// import "../Portfolio.css"

const Portfolio = ({ accountBalance, setAccountBalance, topStocks }) => {
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
  const [topPerformingStocks, setTopPerformingStocks] = useState([]);
  const [topStocksError, setTopStocksError] = useState(null);

  //fetch top performing stocks 

  const fetchTopPerformingStocks = async () => {
    const options = {
      method: "GET",
      url: "http://localhost:3000/api/top-performing",
    };
    
  
    try {
      const response = await axios.request(options);
      console.log("API Response:", response.data);
      setTopPerformingStocks(response.data.finance.result[0].quotes || []);
    } catch (err) {
      console.error("Error fetching top performing stocks:", err);
      setTopStocksError("Failed to load top performing stocks");
    }
  };
  
  
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
        `http://localhost:3000/api/stocks?symbols=${searchSymbol
          .trim()
          .toUpperCase()}`,
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
      setAccountBalance(newBalance);
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
      setAccountBalance(newBalance);
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
    fetchTopPerformingStocks(); 
  }, [fetchTradeHistory]);

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="content-grid">
      <div className="left-column">
        <div className="search-bar">
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
      </div>

      {searchedStock && (
        <StockInformation
          searchedStock={searchedStock}
          quantity={quantity}
          setQuantity={setQuantity}
          handleBuyStock={handleBuyStock}
        />
      )}

      <TopStocksInfo stocks={topStocks} />

      <TopPerformingStocks
  performingStocks={topPerformingStocks}
  error={topStocksError}
/>
      </div>

  <div className="middle-column">
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

  </div>
  <div className="right-column">
      <TradeHistory
        tradeHistory={tradeHistory}
        showTradeHistory={showTradeHistory}
        setShowTradeHistory={setShowTradeHistory}
      />
      </div>
    </div>
  );
};

export default Portfolio;
