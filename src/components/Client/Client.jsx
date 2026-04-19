import "./Reservation.css";

export default function ClientCard({clientName, email}) {

  return (
    <div className="booking-card">
      <div className="booking-card-info">
        <p className="booking-card-text">
          <span className="booking-card-label">{clientName}</span>
          
        </p>
        <p className="booking-card-text">
          <span className="booking-card-label">{email}</span>
        </p>
      </div>
    </div>
  );
}