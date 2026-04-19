import { useState } from "react";
import "./Search.css";

const REGIONS = ["Все", "Дагестан", "Алтай", "Кавказ", "Крым", "Байкал"];

export default function SearchSection({ onSearch }) {
  const [search, setSearch] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [region, setRegion] = useState("Все");

  const filteredHotels = []; // Ваша логика фильтрации

  return (
    <>
      {/* Search bar */}
      <div className="search-container">
        <div className="search-form">
          <div className="search-field">
            <label className="search-label">Клиент</label>
            <input
              type="text"
              placeholder="ФИО клиента"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="search-field-date">
            <label className="search-label">С</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="search-field-date">
            <label className="search-label">До</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="search-button-wrapper">
            <button className="search-button">Найти</button>
          </div>
        </div>
      </div>

      
    </>
  );
}

{/* Filters + Results 
      <section className="results-section">
        
        <div className="region-filters">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`region-button ${region === r ? "region-button-active" : "region-button-inactive"}`}
            >
              {r}
            </button>
          ))}
        </div>

        
        <p className="results-count">
          Найдено отелей: <span className="results-count-number">{filteredHotels.length}</span>
        </p>
      </section>*/}