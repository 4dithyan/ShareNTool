import React from 'react';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({ search, setSearch, city, setCity, category, setCategory, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar-wrapper">
      <div className="search-field">
        <Search size={18} color="#D48C00" />
        <input
          type="text"
          placeholder="Search drill, vacuum, ladder, mower, kit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="search-divider" />

      <div className="search-field">
        <MapPin size={18} color="#D48C00" />
        <input
          type="text"
          placeholder="Area or City (e.g. South Delhi)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="search-divider" />

      <div className="search-field" style={{ minWidth: 160 }}>
        <SlidersHorizontal size={18} color="#D48C00" />
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

