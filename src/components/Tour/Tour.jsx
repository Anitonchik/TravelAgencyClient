import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './Tour.css';

export default function TourCard({tour}) {
  const durationPrice = `${tour.price} RUB / ${tour.duration} дней`;
  const dates = `${tour.dateFrom} - ${tour.dateTo}`;


  return (
    <div className="card">
      <img src={tour.image} alt={tour.name} className="image" />

      <div className="info">
        <div className="d-flex flex-column gap-3">
          <h3 className="title">{tour.name}</h3>
          <div className="d-flex flex-column gap-2">
            <p className="direction">{tour.direction}</p>
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

          <span className="badge">{dates}</span>
        </div>
      </div>
    </div>
  );
}
