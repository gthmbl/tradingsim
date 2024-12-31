const SearchBar = ({
  searchSymbol,
  setSearchSymbol,
  fetchStockBySymbol,
  suggestions,
  handleSuggestionClick,
}) => (
  <div>
    <input
      type="text"
      placeholder="Search stock symbol"
      value={searchSymbol}
      onChange={(e) => setSearchSymbol(e.target.value)}
    />
    <button onClick={fetchStockBySymbol}>Search</button>
    {suggestions.length > 0 && (
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          border: "1px solid #ccc",
          borderRadius: "5px",
          maxWidth: "300px",
          marginTop: "5px",
          position: "absolute",
          background: "#fff",
          zIndex: 10,
        }}
      >
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => handleSuggestionClick(suggestion.symbol)}
            style={{
              cursor: "pointer",
              padding: "5px 10px",
              borderBottom:
                index === suggestions.length - 1
                  ? "none"
                  : "1px solid #ccc",
            }}
          >
            <strong>{suggestion.symbol}</strong> - {suggestion.name}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SearchBar;
