import "./Flight.css";

export default function FlightCard({ flight, selected, onSelect }) {
  const formatDate = (date) => {
    /*if (!dateString) return 'Дата не указана';
    
    const date = new Date(dateString);*/
    
    if (isNaN(date.getTime())) return 'Неверная дата';
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flight-card ${selected ? "flight-card-selected" : "flight-card-default"}`}
    >
      <p className="flight-airline">{flight.airlineName }</p>
      <p className="flight-datetime">
        {formatDate(flight.date)} {flight.time}
      </p>
      <p className="flight-price">{flight.price}</p>
    </button>
  );
}