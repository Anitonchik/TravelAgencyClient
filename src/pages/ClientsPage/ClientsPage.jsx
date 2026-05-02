import { use, useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import "./ClientsPage.css";
import СlientCard from "../../components/Client/Client";


const clients = [
  {
    id: 1,
    clientName: "Гальцова Елизавета Игоревна",
    email: "ssss"
  },
  {
    id: 2,
    clientName: "Михаил Петров",
    email: "ssss"
  },
  {
    id: 3,
    clientName: "Анна Сидорова",
    email: "ssss"
  },
  {
    id: 4,
    clientName: "Дмитрий Волков",
    email: "ssss"
  },
  {
    id: 5,
    clientName: "Елена Новикова",
    managerName: "Иван Козлов",
    email: "ssss"
  }
];

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const reservationProcess = location.state?.reservationProcess;
  
  const filteredClients = useMemo(() => {
    if (!search.trim()) {
      return clients;
    }
    
    return clients.filter(client => 
      client.clientName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleClientClick = (client) => {
    if (reservationProcess) {
      navigate("/reservations/create", { state: { client } });
    } else {
      navigate(`/clients/${client.id}`);
    }
  }

  return (
    <div className="clients-container">

    <main className="clients-main">
        {(!reservationProcess) ? (
          <>
            <div className="create-client-button-container">
              <button
                onClick={() => navigate("/clients/create")}
                className="create-client-button"
              >
                Создать клиента
              </button>
            </div>
          
            <div className="page-header">
              <h1 className="page-title">
                Клиенты
              </h1>
            </div>
        </>) : (
          <div className="page-header">
              <h1 className="page-title">
                Выберите клиента для бронирования тура
              </h1>
            </div>
        )}

        <div className="search-container">
          <div className="search-form">
            <div className="search-field">
              <label className="search-label">Клиент</label>
              <input
                type="text"
                placeholder="ФИО клиента"
                //value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="search-button-wrapper">
              <button className="search-button">Найти</button>
            </div>
          </div>
        </div>

        <div className="clients-list">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <СlientCard
                key={client.id}
                client = {client}
                onClick={() => handleClientClick(client)}
              />
            ))
          ) : (
            <div className="empty-state">
              Нет клиентов, соответствующих вашему запросу.
            </div>
          )}
        </div>
      </main>

    </div>
  );
}