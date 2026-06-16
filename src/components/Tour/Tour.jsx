import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CITIES } from "../../constants/cities";
import './Tour.css';

export default function TourCard({tour, onClick}) {
  let newDateFrom = new Date(tour.dateFrom).toLocaleDateString();
  let newDateTo = new Date(tour.dateTo).toLocaleDateString();
  tour.dateFrom = newDateFrom;
  tour.dateTo = newDateTo;
  const durationPrice = `${tour.price} RUB / ${tour.duration} дней`;
  const dates = `${tour.dateFrom} - ${tour.dateTo}`;

  //console.log(tour);


  return (
    <div 
    className="card"
    onClick={onClick}
    >
      <img src={tour.image} alt={tour.name} className="image" />

      <div className="info">
        <div className="d-flex flex-column gap-3">
          <h3 className="title">{tour.name}</h3>
          <div className="d-flex flex-column gap-2">
            <p className="direction"> {CITIES.find(city => city.value === tour.direction)?.label || "Не указан"}</p>
            <p className="description">{tour.description}</p>
          </div>
        </div>

        <div className="bottomRow">
          <div className="badges">
            <span className="badge" style={{fontSize: '16px'}}>{durationPrice}</span>
            {(tour.isTransferExists) && (
              <span className="badge">Трансфер</span>
            )}
            {(tour.isInsurancesExists) && (
              <span className="badge">Страхование</span>
            )}
            
          </div>

          <span className="badge-date">{dates}</span>
        </div>
      </div>
    </div>
  );
}
