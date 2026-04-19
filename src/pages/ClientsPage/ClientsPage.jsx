import { use, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/header";
import "./ClientsPage.css";
import СlientCard from "../../components/Client/Client";
import Footer from "../../components/Footer/Footer";


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

export default function ClientsPage({reservationProcess = false}) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  const filteredClients = useMemo(() => {
    if (!search.trim()) {
      return clients;
    }
    
    return clients.filter(client => 
      client.clientName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="clients-container">
      <Header />

    <main className="clients-main">
        {(!reservationProcess) && (<div className="create-client-button-container">
          <button
            onClick={() => navigate("/clients/create")}
            className="create-client-button"
          >
            Создать клиента
          </button>
        </div>)}
        
        <div className="page-header">
          <h1 className="page-title">
            Клиенты
          </h1>
        </div>

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
                clientName={client.clientName}
                email={client.email}
              />
            ))
          ) : (
            <div className="empty-state">
              Нет клиентов, соответствующих вашему запросу.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}