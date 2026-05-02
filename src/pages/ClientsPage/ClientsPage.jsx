import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import "./ClientsPage.css";
import СlientCard from "../../components/Client/Client";


const clients = [
  {
    id: 1,
    clientName: "Гальцова Елизавета Игоревна",
    email: "ssss",
    preferenceDescription: "Любит пляжный отдых, предпочитает отели с системой «всё включено», интересуется экскурсиями и культурными программами."
  },
  {
    id: 2,
    clientName: "Михаил Петров",
    email: "ssss",
    preferenceDescription: "Предпочитает активный отдых, интересуется горными турами и приключенческими путешествиями, любит открывать новые места."
  },
  {
    id: 3,
    clientName: "Анна Сидорова",
    email: "ssss",
    preferenceDescription: "Любит культурные и исторические туры, интересуется музеями, архитектурой и гастрономическими путешествиями."
  },
  {
    id: 4,
    clientName: "Дмитрий Волков",
    email: "ssss",
    preferenceDescription: "Предпочитает семейный отдых, интересуется курортами с детскими клубами, аквапарками и анимацией для детей."
  },
  {
    id: 5,
    clientName: "Елена Новикова",
    managerName: "Иван Козлов",
    email: "ssss",
    preferenceDescription: "Любит роскошные туры, интересуется отелями 5*, спа-центрами и эксклюзивными предложениями."
  }
];

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const reservationProcess = location.state?.reservationProcess;
  const tour = location.state?.tour;
  
  const filteredClients = useMemo(() => {
    if (!search.trim()) {
      return clients;
    }
    
    return clients.filter(client => 
      client.clientName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleClientClick = (client) => {
    alert("fjvhbkjfvbjgv")
    if (reservationProcess && !tour) {
      navigate("/tours", { state: { reservationProcess: true, client: client } });
    } 
    else if (reservationProcess && tour) {
      navigate("/flight", { state: { tour: tour, client: client, reservationProcess : reservationProcess } });
    }
    else {
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