import React from 'react';
import { FaSearch, FaMapMarkerAlt, FaSlidersH } from 'react-icons/fa';

const SearchBar = ({ search, setSearch, city, setCity, category, setCategory, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar-wrapper">
      <div className="search-field">
        <FaSearch size={16} color="#D48C00" />
        <input
          type="text"
          placeholder="Search drill, vacuum, ladder, mower, kit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <FaMapMarkerAlt size={16} color="#D48C00" />
        <input
          type="text"
          placeholder="Area or City (e.g. Kochi, Trivandrum, Kozhikode)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="search-divider" />

      <div className="search-field" style={{ minWidth: 160 }}>
        <FaSlidersH size={16} color="#D48C00" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="power-tools">Power Tools (Drills, Saws)</option>
          <option value="cleaning">Cleaning & Vacuum Cleaners</option>
          <option value="ladders-scaffolding">Ladders & Heights</option>
          <option value="gardening">Gardening & Lawn Care</option>
          <option value="hand-tools">Hand Tools & Toolkits</option>
          <option value="painting">Painting & Decorating</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary" style={{ minWidth: 110 }}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
