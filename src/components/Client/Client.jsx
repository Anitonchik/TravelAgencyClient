import "./Client.css";

export default function ClientCard({client, onClick}) {
  

  return (
    <div 
    className="client-card"
    onClick={onClick} 
    >
      <div className="client-card-info">
        <p className="client-card-text">
          <span className="client-card-label">{client.clientName}</span>
          
        </p>
        <p className="client-card-text">
          <span className="client-card-label">{client.email}</span>
        </p>
      </div>
    </div>
  );
}