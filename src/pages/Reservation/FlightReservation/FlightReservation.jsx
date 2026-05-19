import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FlightReservation.css";
import FlightCard from "../../../components/Flight/Flight";


export default function FlightReservation() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationProcess = location.state?.reservationProcess;
  const client = location.state?.client;
  const tour = location.state?.tour;
  const reservation = location.state?.reservation;

  const OUTBOUND_FLIGHTS = tour?.flightsTo || [];
  const RETURN_FLIGHTS = tour?.flightsFrom || [];

  console.log(OUTBOUND_FLIGHTS)

  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const outFlight = OUTBOUND_FLIGHTS?.find((f) => f.id === selectedOutbound?.id);
  const retFlight = RETURN_FLIGHTS?.find((f) => f.id === selectedReturn?.id);

  const totalPrice =
    (outFlight ? parseInt(outFlight.price || "0") : 0) +
    (retFlight ? parseInt(retFlight.price || "0") : 0);

    
  const hasOutboundFlights = OUTBOUND_FLIGHTS && OUTBOUND_FLIGHTS.length > 0;
  const hasReturnFlights = RETURN_FLIGHTS && RETURN_FLIGHTS.length > 0;
  
  const canContinue = hasOutboundFlights && hasReturnFlights && selectedOutbound && selectedReturn;

  const noOutboundMessage = !hasOutboundFlights && "Нет доступных рейсов в место назначение";
  const noReturnMessage = !hasReturnFlights && "Нет доступных рейсов из места назначения";

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Неверная дата';
      return date.toLocaleDateString('ru-RU');
    } catch (error) {
      return 'Ошибка даты';
    }
  };

  const handleStartReservationClick = async () => {
    if (reservationProcess) {
      reservation.flightTo = selectedOutbound;
      reservation.flightFrom = selectedReturn;

      navigate("/hotels", {
                state: {
                  tour: tour, 
                  client: client, 
                  reservation: reservation,
                  reservationProcess: reservationProcess, 
                }
              }); 
    }
  }
  

  return (
    <div className="flight-booking">
      <main className="flight-main">
        <p className="client-info">
          Выбор тура для клиента {client.lastName + " " + client.firstName + " " + client.surName}
        </p>

        <div className="tour-pill">
          <span className="tour-name">
            {tour.name}
          </span>
        </div>

        <div className="flights-card">
          <h2 className="flights-title">Авиабилеты</h2>

          <section className="flights-section">
            <p className="flight-route">
              Ульяновск — {tour.direction}
            </p>
            {hasOutboundFlights ? (
              <div className="flights-grid">
                {OUTBOUND_FLIGHTS.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    selected={selectedOutbound?.id === flight.id}
                    onSelect={() => setSelectedOutbound(flight)}
                  />
                ))}
              </div>
            ) : (
              <div className="no-flights-message">
                {noOutboundMessage}
              </div>
            )}
          </section>

          <div className="divider" />

          <section className="flights-section">
            <p className="flight-route">
              {tour.direction} — Ульяновск
            </p>
            {hasReturnFlights ? (
              <div className="flights-grid">
                {RETURN_FLIGHTS.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    selected={selectedReturn?.id === flight.id}
                    onSelect={() => setSelectedReturn(flight)}
                  />
                ))}
              </div>
            ) : (
              <div className="no-flights-message">
                {noReturnMessage}
              </div>
            )}
          </section>

          {canContinue && (
            <div className="summary">
              <span className="summary-route">
                {outFlight?.airlineName || outFlight?.airline} · {formatDate(outFlight?.date)} →{" "}
                {retFlight?.airlineName || retFlight?.airline} · {formatDate(retFlight?.date)}
              </span>
              <span className="summary-price">
                Итого: {totalPrice.toLocaleString()} RUB
              </span>
            </div>
          )}
          
          
          {(!hasOutboundFlights || !hasReturnFlights) && (
            <div className="warning-message">
              Невозможно забронировать авиабилеты: отсутствуют рейсы{' '}
              {!hasOutboundFlights && 'в место назначения'}
              {!hasOutboundFlights && !hasReturnFlights && 'и '}
              {!hasReturnFlights && 'из места назначения'}
            </div>
          )}
        </div>

        <div className="actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="button-flight button-cancel-flight"
          >
            Отменить
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => handleStartReservationClick()}
            className={`button-flight button-continue-flight ${!canContinue ? "button-disabled-flight" : ""}`}
          >
            Продолжить
          </button>
        </div>
      </main>
    </div>
  );
}