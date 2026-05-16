import "./Client.css";

export default function ClientCard({client, onClick}) {
  

  return (
    <div 
    className="client-card"
    onClick={onClick} 
    >
      <div className="client-card-info">
        <p className="client-card-text">
          <span className="client-card-label card-client-name">{client.lastName} {client.firstName} {client.surName}</span>
          
        </p>
        <p className="client-card-text ">
          <span className="client-card-label card-client-email">{client.email}</span>
        </p>
      </div>
    </div>
  );
}