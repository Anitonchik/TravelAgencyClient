import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Reservation from "../../../client/ReservationRq";
import "./TourDetails.css";

// Маппинг типов туров
const TOUR_TYPE_MAP = {
  excursion: "Экскурсионный",
  HEALTH: "Оздоровительный",
  SPORTS: "Спортивный"
};

// Маппинг интенсивности туров
const TOUR_INTENSITY_MAP = {
  Passive: "Пассивный",
  Usual: "Обычный",
  Active: "Активный"
};

export default function TourDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationProcess = location.state?.reservationProcess;
  const client = location.state?.client;
  const tour = location.state?.tour;

  // Получаем русские названия для типа тура и интенсивности
  const tourTypeTitle = useMemo(() => {
    return TOUR_TYPE_MAP[tour.tourType] || tour.tourType || "Не указан";
  }, [tour.tourType]);

  const tourIntensityTitle = useMemo(() => {
    return TOUR_INTENSITY_MAP[tour.tourIntensity] || tour.intensity || "Не указана";
  }, [tour.intensity]);

  const reservationApi = useMemo(() => new Reservation(), []);

  let newDateFrom = new Date(tour.dateFrom).toLocaleDateString();
  let newDateTo = new Date(tour.dateTo).toLocaleDateString();
  tour.dateFrom = newDateFrom;
  tour.dateTo = newDateTo;
  const durationPrice = `${tour.price} RUB / ${tour.duration} дней`;
  const dates = `${tour.dateFrom} - ${tour.dateTo}`;

  const handleStartReservationClick = async (tour) => {
    if (reservationProcess) {
      let reservation = {
        reservationDate: new Date(),
        managerId: 1,             //ИСПРАВИТЬ ПРИ НАСТРОЙКЕ АВТОРИЗАЦИИ
        clientId: client.id,
        tourId: tour.id
      }
      

      const res = await reservationApi.startReservation(reservation);
      console.log(res)

      reservation = {
        id: res.id,
        reservationDate: new Date(),
        managerId: 1,             //ИСПРАВИТЬ ПРИ НАСТРОЙКЕ АВТОРИЗАЦИИ
        client: client,
        tour: tour,
        flightTo: null,
        flightFrom: null,
        hotel: null,
        indicateTransfer: null,
        indicateInsurance: null,
        paymentType: null,
        insuranceType: null
      }
      
      navigate("/flights", { 
        state: { 
          tour: tour, 
          client: client, 
          reservation: reservation,
          reservationProcess: reservationProcess, 
        } 
      });
    } else {
      navigate("/clients", {state: {reservationProcess: true, tour: tour}});
    }
  }  


  return (
    <div className="tour-booking-container">
      <main className="main-content">
        {reservationProcess && (
          <aside className="sidebar">
            <div className="client-info-card">
              <div className="client-info-content">
                <div>
                  <p className="info-label">
                    Клиент
                  </p>
                  <p className="info-value">
                    {client?.lastName + " " + client?.firstName + " " + client?.surName || "Имя клиента"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        )}

        <div className="tour-name-pill">
          <span className="tour-name-text">
            {tour.name}
          </span>
        </div>

        {/* Single photo */}
        <div className="photo-container">
          <img
            src={tour.image}
            alt={tour.name}
            className="tour-photo"
          />
        </div>

        {/* Activity + Tour type row */}
        <div className="info-row">
          <p className="info-text">
            Интенсивность:{" "}
            <span className="info-value">{tourIntensityTitle}</span>
          </p>
          <p className="info-text info-text-right">
            Тип тура:{" "}
            <span className="info-value">{tourTypeTitle}</span>
          </p>
        </div>

        {/* Description */}
        <div className="description-container">
          <p key={"desc"} className="description-text">
            {tour.description}
          </p>
        </div>

        {/* Price pills row */}
        <div className="price-row">
          <div className="price-pill price-pill-left">
            <span className="price-text">
              {durationPrice}
            </span>
          </div>

          <div className="price-pill price-pill-left">
            <span className="price-text">
              {dates}
            </span>
          </div>
        </div>

        {/* CTA Button — green border */}
        <div className="cta-container">
          <button
            onClick={() => handleStartReservationClick(tour)}
            className="cta-button"
          >
            Начать бронирование тура
          </button>
        </div>
      </main>
    </div>
  );
}