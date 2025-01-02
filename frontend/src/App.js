import React, { useState, useEffect } from "react"; //useState manages data from functional component | useEffect runs side effects after component is rendered
import Portfolio from "./Portfolio";
import Login from "./Login";
import Header from "./components/Header" 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stocks, setStocks] = useState([]) // state to hold stock data starting with an empty array
  const [loading, setLoading] = useState(true); // checks whether data is still being fetched, starting as true
  const [error, setError] = useState(null); // state for error messages 
  const [username, setUsername] = useState(""); //state for user's name
  const [accountBalance, setAccountBalance] = useState(0); //account balance 

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
      const response = await fetch("http://localhost:3000/api/portfolio", {
        headers: { Authorization: `Bearer ${token}`},
      });

      if (!response.ok) {
        throw new Error("Token validation failed");
      }

      const data = await response.json();
      setUsername(data.username);
      setAccountBalance(data.balance); 
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
  useEffect(() => { //useEffect runs code inside it after component is rendered (fetches stock data from server)
    if (!isLoggedIn) return; //skip fetching data if not logged in

    const fetchStockData = async () => { //makes http request to fetch stock data from back-end API
      setLoading(true); //start loading
      try {
        const token = localStorage.getItem("token"); //get token from localStorage
        const response = await fetch(
          "http://localhost:3000/api/stocks?symbols=AAPL,MSFT,TSLA,GOOG", 
          {
            headers: {Authorization: `Bearer ${token}` },
          } 
        ); //sends request, waits for data from server
        
        
        if (!response.ok) { //checks if response is okay, if not it throws an error
          throw new Error (`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); //Parse JSON data //converts raw data into usable JSON data
        setStocks(data); // updates the stocks state with the fetched data
        setError(null); //clear previous errors
      } catch (err) { //catches errors
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
      <Header
        portfolioName={username ? `${username}'s Portfolio` : "Portfolio"} // Dynamically pass username
        accountBalance={accountBalance} // Dynamically pass account balance
        onLogout={handleLogout} // Pass logout handler
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <Portfolio />
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
        </>
      )}
    </div>
  );
}

export default App;