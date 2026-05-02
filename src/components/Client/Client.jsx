import "./Client.css";

export default function ClientCard({client}) {
  

  return (
    <div className="booking-card">
      <div className="booking-card-info">
        <p className="booking-card-text">
          <span className="booking-card-label">{client.clientName}</span>
          
        </p>
        <p className="booking-card-text">
          <span className="booking-card-label">{client.email}</span>
        </p>
      </div>
    </div>
  );
}