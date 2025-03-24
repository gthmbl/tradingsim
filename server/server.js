const express = require("express"); //framework simplifies building server in node.js - allows us to define routes
const bodyParser = require("body-parser"); //parses incoming request bodies into JSON
const axios = require("axios"); //library for making HTTP requests to Yahoo finance API
const cors = require("cors"); //Handles cross origin requests between front & backend
require("dotenv").config(); //reads enviornment variables from .env file (API key) making them available here

const app = express(); //used to define routes and handle requests
const PORT = 3000; //specifies the port where our server will listen for incoming requests.
const API_KEY = process.env.YAHOO_API_KEY; //loads API key from .env file and stores it in API_KEY variable
console.log("API Key Loaded", API_KEY); //outputs the API key to the console to check it loaded correctly

//Middleware functions execute everytime the server receives a request before it reaches route handlers
app.use(
  cors({
    origin: "http://localhost:3008",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // allows browser to speak with server - without it, the browser will block requests
app.use(bodyParser.json()); //Parses JSON bodies in requests into JavaScript Objects

//JWT for authentication
const jwt = require("jsonwebtoken");
const db = require("./db"); //import database connection
const bcrypt = require("bcrypt");

//middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Access denied. Token not provided." });
  }

  const token = authHeader.split(" ")[1]; //extract token from the Bearer <token> format
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); //DEBUGGING LOG
    req.user = decoded; // attaching decoded user info to the request object
    next(); //Pass control to next handler
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

//root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//fetch stock data
const YAHOO_API_URL =
  "https://yahoo-finance166.p.rapidapi.com/api/market/get-quote"; //Base URL for API

app.get("/api/stocks", async (req, res) => {
  const symbols = req.query.symbols; //reads symbol query parameter in incoming request
  if (!symbols) {
    return res.status(400).json({ error: "Please provide stock symbols" }); //if no symbols, display error message
  }

  try {
    //Make request to Yahoo API
    const response = await axios.get(YAHOO_API_URL, {
      params: { symbols }, //pass stock symbols to API
      headers: {
        "x-rapidapi-host": "yahoo-finance166.p.rapidapi.com", // Required header for Yahoo Finance API
        "x-rapidapi-key": API_KEY, // API key from RapidAPI
      },
    });

    // extract and clean data from API response extracting only relevant stock data
    const stockData = response.data.quoteResponse.result.map((stock) => ({
      symbol: stock.symbol,
      name: stock.shortName,
      price: stock.regularMarketPrice,
      currency: stock.currency,
    }));

    if (stockData.length === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.status(200).json(stockData);
  } catch (err) {
    console.error("Error fetching stock data:", err.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// TRADE HISTORY ENDPOINT
app.get("/api/trade-history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [history] = await db.query(
      "SELECT stock_symbol, trade_type, quantity, price, trade_date FROM trade_history WHERE user_id = ? ORDER BY trade_date DESC",
      [userId]
    );
    res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching trade history:", err.message);
    res.status(500).json({ error: "Failed to fetch trade history" });
  }
});

//USER REGISTERATION
app.post("/api/register", async (req, res) => {
  console.log("hehehe");
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    //does user already exist?
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    ); //ensures emails are unique
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" }); //stops registration if email is already in use
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); //log hashed password

    //add new user to database
    const [result] = await db.query(
      "INSERT INTO users (username, email, password, balance) VALUES (?, ?, ?, ?)", //adds row to user table
      [username, email, hashedPassword, 10000.0] //$10,000 initial balance
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.log(err);
    console.error("Error during user registeration:", err.message);
    res.status(500).json({ error: "An error occurred during registeration" });
  }
});

// LOGIN ROUTE
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if user exists
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = user[0]; //get user data
    //compare input password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    //generate token
    const token = jwt.sign(
      { id: userData.id, email: userData.email, username: userData.username }, //payload
      process.env.JWT_SECRET, //access secret key from .env
      { expiresIn: "1h" } //token validity
    );

    res.status(200).json({
      message: "Login succesful",
      userId: userData.id,
      username: userData.username,
      token: token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "An error occured during login" });
  }
});

//PORTFOLIO ENDPOINT
app.get("/api/portfolio", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user balance and username
    const [user] = await db.query(
      "SELECT username, balance FROM users WHERE id = ?",
      [userId]
    );
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { username, balance } = user[0];

    // Fetch portfolio
    const [portfolio] = await db.query(
      "SELECT * FROM portfolio WHERE user_id = ?",
      [userId]
    );

    if (portfolio.length > 0) {
      // Get stock symbols
      const symbols = portfolio.map((item) => item.stock_symbol).join(",");

      // Fetch current prices for portfolio stocks
      const response = await axios.get(YAHOO_API_URL, {
        params: { symbols },
        headers: {
          "x-rapidapi-host": "yahoo-finance166.p.rapidapi.com",
          "x-rapidapi-key": API_KEY,
        },
      });

      const stockPrices = response.data.quoteResponse.result.reduce(
        (acc, stock) => {
          acc[stock.symbol] = stock.regularMarketPrice;
          return acc;
        },
        {}
      );

      // Append current prices to the portfolio
      portfolio.forEach((item) => {
        item.average_price = parseFloat(item.average_price) || 0; // Convert to number
        item.quantity = parseInt(item.quantity, 10) || 0; // Convert to integer
        item.current_price = stockPrices[item.stock_symbol] || null;
      });
    }

    // Send the response
    return res.status(200).json({ portfolio, balance, username }); // Include username in the response
  } catch (err) {
    console.error("Error fetching portfolio and balance:", err.message);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching portfolio." });
  }
});

// Autocomplete endpoint
app.get("/api/autocomplete", authenticateToken, async (req, res) => {
  const query = req.query.query; // Access the 'query' parameter properly
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  console.log("Query received:", query); // Log the received query for debugging

  try {
    const response = await axios.get(
      "https://yahoo-finance166.p.rapidapi.com/api/autocomplete",
      {
        params: { query }, // Pass the query to the external API
        headers: {
          "x-rapidapi-host": "yahoo-finance166.p.rapidapi.com",
          "x-rapidapi-key": process.env.YAHOO_API_KEY, // Use your API key from .env
        },
      }
    );

    console.log("Yahoo Finance API Response:", response.data); // Debug log the response

    if (!response.data.quotes || response.data.quotes.length === 0) {
      return res.json({ quotes: [] }); // Return empty array if no results are found
    }

    res.json({ quotes: response.data.quotes }); // Return the quotes from API response
  } catch (err) {
    console.error("Error fetching autocomplete suggestions:", err.message);
    res.status(500).json({ error: "Failed to fetch suggestions" }); // Return an error response
  }
});

// BUYING STOCK
app.post("/api/buy-stock", authenticateToken, async (req, res) => {
  const { stockSymbol, quantity, price } = req.body;
  const userId = req.user.id;

  console.log("Received request to buy stocks:", {
    stockSymbol,
    quantity,
    price,
  });

  if (!stockSymbol || !quantity || !price) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    //fetch user's current balance
    const [user] = await db.query("SELECT balance FROM users WHERE id = ?", [
      userId,
    ]);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentBalance = parseFloat(user[0].balance);
    const totalCost = quantity * price;

    if (currentBalance < totalCost) {
      return res
        .status(400)
        .json({ error: "Insufficient balance to complete the purchase" });
    }

    let message = ""; // To store success message

    // Check if the stock already exists in the user's portfolio
    const [existingStock] = await db.query(
      "SELECT * FROM portfolio WHERE user_id = ? AND stock_symbol = ?",
      [userId, stockSymbol]
    );

    if (existingStock.length > 0) {
      const stock = existingStock[0];
      const newQuantity = stock.quantity + quantity;
      const newAveragePrice =
        (stock.quantity * stock.average_price + quantity * price) / newQuantity;

      await db.query(
        "UPDATE portfolio SET quantity = ?, average_price = ? WHERE user_id = ? AND stock_symbol = ?",
        [newQuantity, newAveragePrice, userId, stockSymbol]
      );
      message = "Stock updated successfully";
    } else {
      await db.query(
        "INSERT INTO portfolio (user_id, stock_symbol, quantity, average_price) VALUES (?, ?, ?, ?)",
        [userId, stockSymbol, quantity, price]
      );
      message = "New stock added successfully";
    }

    //deduct cost from user balance
    const newBalance = currentBalance - totalCost;
    await db.query("UPDATE users SET balance = ? WHERE id = ?", [
      newBalance,
      userId,
    ]);

    // Insert transaction into trade_history table
    await db.query(
      "INSERT INTO trade_history (user_id, stock_symbol, quantity, price, trade_type, trade_date) VALUES (?, ?, ?, ?, ?, NOW())",
      [userId, stockSymbol, quantity, price, "BUY"]
    );
    console.log("Transaction recorded in trade history (BUY)");

    // Send a single response after all operations are successful
    res.status(201).json({ message, newBalance });
  } catch (err) {
    console.error("Error buying stock:", err.message);
    res.status(500).json({ error: "Failed to buy stock" });
  }
});

// SELL STOCK
app.post("/api/sell-stock", authenticateToken, async (req, res) => {
  const { stockSymbol, quantity } = req.body;
  const userId = req.user.id;

  if (!stockSymbol || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid stock symbol or quantity" });
  }

  try {
    //check user owns stock
    const [existingStock] = await db.query(
      "SELECT * FROM portfolio WHERE user_id = ? AND stock_symbol = ?",
      [userId, stockSymbol]
    );

    if (existingStock.length === 0) {
      return res
        .status(400)
        .json({ error: "Stock not found in the portfolio" });
    }

    const stock = existingStock[0];

    if (stock.quantity < quantity) {
      console.log("insufficient quantity to sell");
      return res.status(400).json({ error: "Insufficient quantity to sell" });
    }

    const saleAmount = stock.average_price * quantity;

    //calculate new quantity after selling
    const newQuantity = stock.quantity - quantity;

    if (newQuantity > 0) {
      await db.query(
        "UPDATE portfolio SET quantity = ? WHERE user_id = ? AND stock_symbol = ?",
        [newQuantity, userId, stockSymbol]
      );
    } else {
      await db.query(
        "DELETE FROM portfolio WHERE user_id = ? AND stock_symbol = ?",
        [userId, stockSymbol]
      );
    }

    //update user balance
    const [user] = await db.query("SELECT balance FROM users WHERE id = ?", [
      userId,
    ]);
    const currentBalance = parseFloat(user[0].balance);
    const newBalance = currentBalance + saleAmount;
    await db.query("UPDATE users SET balance = ? WHERE id = ?", [
      newBalance,
      userId,
    ]);

    // Record the transaction in trade_history
    await db.query(
      "INSERT INTO trade_history (user_id, stock_symbol, quantity, price, trade_type, trade_date) VALUES (?, ?, ?, ?, ?, NOW())",
      [userId, stockSymbol, quantity, stock.average_price, "SELL"]
    );

    console.log("Transaction recorded in trade history");

    //TODO: record this transaction in transaction table

    res.status(200).json({ message: "Stock sold successfully", newBalance });
  } catch (err) {
    console.error("Error selling stock:", err.message);
    res.status(500).json({ error: "Failed to sell stock" });
  }
});

app.get("/api/trade-history", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1; //current page
  const pageSize = parseInt(req.query.pageSize) || 10; //page size 10
  const offset = (page - 1) * pageSize;

  try {
    const userId = req.user.id;
    const [history] = await db.query(
      "SELECT stock_symbol, trade_type, quantity, price, trade_date FROM trade_history WHERE user_id = ? ORDER BY trade_date DESC LIMIT ? OFFSET ?",
      [userId, pageSize, offset]
    );
    res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching trade history:", err.message);
    res.status(500).json({ error: "Failed to fetch trade history" });
  }
});

const marketRoute = require("./market"); // Adjust path as needed
app.use("/api", marketRoute);

//starts the server, listening for incoming requests on port 3000, logging confirmation to console.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
