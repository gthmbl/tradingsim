import React, { useState, useEffect } from "react"; //useState manages data from functional component | useEffect runs side effects after component is rendered
import Portfolio from "./components/Portfolio";
import Login from "./Login";
import Header from "./components/Header";
import "./App.css";
import './ButtonStyles.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stocks, setStocks] = useState([]); // state to hold stock data starting with an empty array
  const [loading, setLoading] = useState(true); // checks whether data is still being fetched, starting as true
  const [error, setError] = useState(null); // state for error messages
  const [username, setUsername] = useState(""); //state for user's name
  const [accountBalance, setAccountBalance] = useState(0); //account balance
  const [portfolio, setPortfolio] = useState([]);

  //validate token on inital load

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found in localStorage");
        localStorage.clear();
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        const data = await response.json();
        setUsername(data.username);
        setAccountBalance(data.balance);
        setPortfolio(data.portfolio);
        setIsLoggedIn(true);
      } catch (err) {
        console.error(err.message);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    };

    validateToken();
  }, []);

  //function handles login success

  const handleLoginSuccess = (response) => {
    setIsLoggedIn(true); //update login state
    setUsername(response.username);
    setAccountBalance(response.balance);
  };

  //handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); //clear token
    setIsLoggedIn(false); //resets login state
    setUsername("");
    setAccountBalance(0);
  };

  //fetching data
  useEffect(() => {
    //useEffect runs code inside it after component is rendered (fetches stock data from server)
    if (!isLoggedIn) return; //skip fetching data if not logged in

    const fetchStockData = async () => {
      //makes http request to fetch stock data from back-end API
      setLoading(true); //start loading
      try {
        const token = localStorage.getItem("token"); //get token from localStorage
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/stocks?symbols=AAPL,MSFT,TSLA,GOOG,AMZN,NFLX,META`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ); //sends request, waits for data from server

        if (!response.ok) {
          //checks if response is okay, if not it throws an error
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); //Parse JSON data //converts raw data into usable JSON data
        setStocks(data); // updates the stocks state with the fetched data
        setError(null); //clear previous errors
      } catch (err) {
        //catches errors
        setError(err.message); //save error message
        setStocks([]); //clear stocks if there's an error
      } finally {
        setLoading(false); //always stop loading
      }
    };

    fetchStockData(); //Call the fetch function
  }, [isLoggedIn]); //re-run effect hen 'isLoggedIn' changes

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const portfolioName = username ? `${username}'s Portfolio` : "Portfolio";

  // Main render logic
  return (
    <div>
      {/* Header */}

      <Header
        portfolioName={username ? `${username}'s Portfolio` : "Portfolio"} // Dynamically pass username
        accountBalance={accountBalance} // Dynamically pass account balance
        onLogout={handleLogout} // Pass logout handler
      />

      {/* Main Content */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Portfolio
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          accountBalance={accountBalance}
          setAccountBalance={setAccountBalance}
          topStocks={stocks}
        />
      )}
    </div>
  );
}

export default App;
