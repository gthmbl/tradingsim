import React from "react";
import "../SearchBar.css"; 
import "../ButtonStyles.css"

const SearchBar = ({
  searchSymbol,
  setSearchSymbol,
  fetchStockBySymbol,
  suggestions,
  handleSuggestionClick,
}) => (
  <div className="search-bar-container">
    <input
      type="text"
      className="search-input"
      placeholder="Search stock symbol"
      value={searchSymbol}
      onChange={(e) => setSearchSymbol(e.target.value)}
    />
    <button className="button button-primary"  onClick={fetchStockBySymbol}>
      Search
    </button>
    {suggestions.length > 0 && (
      <ul className="suggestions-dropdown">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="suggestion-item"
            onClick={() => handleSuggestionClick(suggestion.symbol)}
          >
            <strong>{suggestion.symbol}</strong> - {suggestion.name}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SearchBar;
