import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SummaryReservation.css";
import TourCard from "../../../components/Tour/Tour";
import FlightCard from "../../../components/Flight/Flight";
import HotelCard from "../../../components/Hotel/Hotel";
import Reservation from "../../../client/ReservationRq";

const InsuranceTypes = {
  MED: "Медицинская страховка",
  AII: "Страхование от несчастных случаев",
  CANC: "Страхование отмены поездки",
  CL: "Страхование гражданской ответственности",
  BAG: "Страхование багажа",
  NO: "Нет"
};

const PaymentTypes = {
  CASH: "Наличные",
  SBP: "СБП",
};

export default function SummaryReservation() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationApi = useMemo(() => new Reservation(), []);

  const reservationProcess = location.state?.reservationProcess;
  const client = location.state?.client;
  const tour = location.state?.tour;
  const reservation = location.state?.reservation;

  const [insurance, setInsurance] = useState("NO");
  const [paymentType, setPaymentType] = useState("CASH");

  const flightTo = reservation?.flightTo;
  const flightFrom = reservation?.flightFrom;
  const hotel = reservation?.hotel;

  
  const tourPrice = tour?.price ? parseInt(tour.price) : 0;
  const outFlightPrice = flightTo?.price ? parseInt(flightTo.price) : 0;
  const retFlightPrice = flightFrom?.price ? parseInt(flightFrom.price) : 0;
  const hotelPrice = hotel?.price ? parseInt(hotel.price) : 0;
  const totalPrice = tourPrice + outFlightPrice + retFlightPrice + hotelPrice;

  const canContinue = true; 
  
  const handleContinue = async () => {
    console.log({id: reservation.id,
        reservationDate: reservation.reservationDate,
        dateOfIssueOfTheVoucher: new Date(),
        managerId: reservation.managerId,
        clientId: reservation.client.id,
        tourId: reservation.tour.id,
        flightToId: reservation.flightTo.id,
        flightFromId: reservation.flightFrom.id,
        hotelId: reservation.hotel.id,
        indicateTransfer: true,
        indicateInsurance: true,
        paymentType: paymentType,
        insuranceType: insurance})
    await reservationApi.endReservation({
        id: reservation.id,
        reservationDate: reservation.reservationDate,
        dateOfIssueOfTheVoucher: new Date(),
        managerId: reservation.managerId,
        clientId: reservation.client.id,
        tourId: reservation.tour.id,
        flightToId: reservation.flightTo.id,
        flightFromId: reservation.flightFrom.id,
        hotelId: reservation.hotel.id,
        indicateTransfer: true,
        indicateInsurance: true,
        paymentType: paymentType,
        insuranceType: insurance
    })

    navigate("/payment", {
      state: {
        reservationProcess,
        client,
        tour,
        reservation
      },
    });
  };

  const formatPrice = (price) => `${price.toLocaleString()} RUB`;

  return (
    <div className="summary-booking">
      <main className="summary-main">
        {/* Информация о клиенте */}
        <p className="client-info">
          Итоги бронирования для клиента {client?.lastName} {client?.firstName} {client?.surName}
        </p>

        {/* Карточка тура */}
        <div className="summary-section">
          <h2 className="section-title">Тур</h2>
          <TourCard tour={tour} onClick={() => {}} />
        </div>

        {/* Перелёты */}
        <div className="summary-section">
          <h2 className="section-title">Авиабилеты</h2>
          <div className="flights-container">
            <div className="flight-direction">
              <p className="flight-route">Ульяновск → {tour?.direction}</p>
              <FlightCard
                flight={flightTo}
                selected={false}
                onSelect={() => {}}
              />
            </div>
            <div className="flight-direction">
              <p className="flight-route">{tour?.direction} → Ульяновск</p>
              <FlightCard
                flight={flightFrom}
                selected={false}
                onSelect={() => {}}
              />
            </div>
          </div>
        </div>

        {/* Отель */}
        <div className="summary-section">
          <h2 className="section-title">Отель</h2>
          <HotelCard hotel={hotel} selected={false} onSelect={() => {}} />
        </div>

        {/* Дополнительные опции */}
        <div className="summary-section">
          <h2 className="section-title">Дополнительно</h2>

          {/* Страховка */}
          <div className="option-group">
            <p className="option-label">Страховка</p>
            <div className="insurance-options">
              <label className="insurance-option">
                <input
                  type="radio"
                  name="insurance"
                  checked={insurance === null}
                  onChange={() => setInsurance(null)}
                />
                Нет
              </label>
              {Object.entries(InsuranceTypes).map(([key, description]) => (
                <label key={key} className="insurance-option">
                  <input
                    type="radio"
                    name="insurance"
                    checked={insurance === key}
                    onChange={() => setInsurance(key)}
                  />
                  {description}
                </label>
              ))}
            </div>
          </div>

          {/* Тип оплаты */}
          <div className="option-group">
            <p className="option-label">Способ оплаты</p>
            <div className="payment-options">
              {Object.entries(PaymentTypes).map(([key, title]) => (
                <label key={key} className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentType === key}
                    onChange={() => setPaymentType(key)}
                  />
                  {title}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Итоговая стоимость */}
        <div className="summary-total">
          <span className="total-label">Общая стоимость:</span>
          <span className="total-price">{formatPrice(totalPrice)}</span>
        </div>

        {/* Кнопки действий */}
        <div className="actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="button button-cancel"
          >
            Отменить
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className={`button button-continue ${!canContinue ? "button-disabled" : ""}`}
          >
            Продолжить
          </button>
        </div>
      </main>
    </div>
  );
}