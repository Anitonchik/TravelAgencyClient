import "./Flight.css";

export default function FlightCard({ flight, selected, onSelect }) {
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: 'Дата не указана', time: 'Время не указано' };
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { date: 'Неверная дата', time: 'Неверное время' };
      
      const formattedDate = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
      
      const formattedTime = date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      return { date: 'Неверная дата', time: 'Неверное время' };
    }
  };

  const dateTime = formatDateTime(flight.date);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flight-card ${selected ? "flight-card-selected" : "flight-card-default"}`}
    >
      <p className="flight-airline">{flight.airlineName }</p>
      <p className="flight-datetime">
        {dateTime.date} {dateTime.time}
      </p>
      <p className="flight-price">{flight.price}</p>
    </button>
  );
}