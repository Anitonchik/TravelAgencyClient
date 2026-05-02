import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FlightReservation.css";
import FlightCard from "../../../components/Flight/Flight";

const CLIENT_NAME = "Гальцова Елизавета Игоревна";
const TOUR_NAME = '"ДАГЕСТАН-ВСЕ ВКЛЮЧЕНО" 3 дня';

const OUTBOUND_FLIGHTS = [
  { id: "out-1", airlineName: "TransAvia",       date: new Date(), price: "20,000 RUB" },
  { id: "out-2", airlineName: "Pegasus Airlines", date: new Date(),  time: "09:00", price: "19,000 RUB" },
  { id: "out-3", airlineName: "Аэрофлот",         date: new Date(),  time: "11:30", price: "23,500 RUB" },
  { id: "out-4", airlineName: "S7 Airlines",      date: new Date(),  time: "06:45", price: "17,800 RUB" },
];

const RETURN_FLIGHTS = [
  { id: "ret-1", airlineName: "TransAvia",       date: new Date(), time: "16:00", price: "20,000 RUB" },
  { id: "ret-2", airlineName: "Pegasus Airlines", date: new Date(), time: "17:00", price: "19,000 RUB" },
  { id: "ret-3", airlineName: "Аэрофлот",         date: new Date(), time: "19:15", price: "22,000 RUB" },
  { id: "ret-4", airlineName: "S7 Airlines",      date: new Date(), time: "07:30", price: "16,900 RUB" },
];



export default function FlightReservation() {
  const navigate = useNavigate();
  const [selectedOutbound, setSelectedOutbound] = useState("out-1");
  const [selectedReturn, setSelectedReturn] = useState("ret-1");

  const outFlight = OUTBOUND_FLIGHTS.find((f) => f.id === selectedOutbound);
  const retFlight = RETURN_FLIGHTS.find((f) => f.id === selectedReturn);

  const totalPrice =
    (outFlight ? parseInt(outFlight.price.replace(/[^0-9]/g, "")) : 0) +
    (retFlight ? parseInt(retFlight.price.replace(/[^0-9]/g, "")) : 0);

  const canContinue = selectedOutbound && selectedReturn;

  return (
    <div className="flight-booking">
      <main className="flight-main">
        {/* Client */}
        <p className="client-info">
          Выбор тура для клиента {CLIENT_NAME}
        </p>

        {/* Tour name pill */}
        <div className="tour-pill">
          <span className="tour-name">
            {TOUR_NAME}
          </span>
        </div>

        {/* Main flights card */}
        <div className="flights-card">
          <h2 className="flights-title">Авиабилеты</h2>

          {/* Outbound */}
          <section className="flights-section">
            <p className="flight-route">
              Ульяновск — Дагестан
            </p>
            <div className="flights-grid">
              {OUTBOUND_FLIGHTS.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  selected={selectedOutbound === flight.id}
                  onSelect={() => setSelectedOutbound(flight.id)}
                />
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="divider" />

          {/* Return */}
          <section className="flights-section">
            <p className="flight-route">
              Дагестан — Ульяновск
            </p>
            <div className="flights-grid">
              {RETURN_FLIGHTS.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  selected={selectedReturn === flight.id}
                  onSelect={() => setSelectedReturn(flight.id)}
                />
              ))}
            </div>
          </section>

          {/* Summary */}
          {canContinue && (
            <div className="summary">
              <span className="summary-route">
                {outFlight?.airline} · {outFlight?.date} {outFlight?.time} →{" "}
                {retFlight?.airline} · {retFlight?.date} {retFlight?.time}
              </span>
              <span className="summary-price">
                Итого: {totalPrice.toLocaleString()} RUB
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
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
            onClick={() => navigate("/tour/1")}
            className={`button button-continue ${!canContinue ? "button-disabled" : ""}`}
          >
            Продолжить
          </button>
        </div>
      </main>
    </div>
  );
}