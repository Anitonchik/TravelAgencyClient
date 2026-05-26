import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ClientsPage.css";
import СlientCard from "../../components/Client/Client";
import Client from "../../client/ClientRq";
import Reservation from "../../client/ReservationRq";

export default function ClientsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationProcess = location.state?.reservationProcess;
  const tour = location.state?.tour;
  
  const [clients, setClients] = useState([]);
  const currentPageRef = useRef(0);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchClientName, setSearchClientName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;
  
  const clientApi = useMemo(() => new Client(), []);
  const reservationApi = useMemo(() => new Reservation(), []);
  const searchTimeoutRef = useRef(null);

  const loadClients = useCallback(async (pageNum, resetList = false) => {
    setIsLoading(true);
    try {
      let data;
      
      if (searchClientName.trim()) {
        data = await clientApi.getByClientName(searchClientName, pageNum, pageSize);
      } else {
        data = await clientApi.getAll(pageNum, pageSize);
      }
      
      const clientsArray = data.content || data;
      
      if (resetList) {
        setClients(clientsArray);
      } else {
        setClients(prev => [...prev, ...clientsArray]);
      }
      
      setTotalCount(data.totalElements || clientsArray.length);
      return data;
    } catch (error) {
      console.error("Ошибка при загрузке клиентов:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clientApi, searchClientName, pageSize]);

  const handleSearchChange = (value) => {
    setSearchClientName(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setClients([]);
      currentPageRef.current = 0;
      setFetching(true);
    }, 300);
  };

  useEffect(() => {
    setClients([]);
    currentPageRef.current = 0;
    setFetching(true);
  }, [searchClientName]);

  useEffect(() => {
    if (!fetching) return;
    
    const loadMore = async () => {
      const pageToLoad = currentPageRef.current;
      const data = await loadClients(pageToLoad, pageToLoad === 0);
      
      if (data && data.content && data.content.length > 0) {
        currentPageRef.current += 1;
      } else if (data && data.content && data.content.length === 0) {
        setFetching(false);
      }
      setFetching(false);
    };
    
    loadMore();
  }, [fetching, loadClients]);

  const scrollHandler = useCallback((e) => {
    const scrollHeight = e.target.documentElement.scrollHeight;
    const scrollTop = e.target.documentElement.scrollTop;
    const clientHeight = window.innerHeight;
    
    if (scrollHeight - (scrollTop + clientHeight) < 100 
        && clients.length < totalCount 
        && !fetching 
        && !isLoading) {
      setFetching(true);
    }
  }, [clients.length, totalCount, fetching, isLoading]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler]);

  
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleClientClick = async (client) => {
    if (reservationProcess && !tour) {
      navigate("/tours", { state: { reservationProcess: true, client: client } });
    } 
    else if (reservationProcess && tour) {
      let reservation = {
        reservationDate: new Date(),
        managerId: localStorage.getItem('userId'),           
        clientId: client.id,
        tourId: tour.id
      }
      
      const res = await reservationApi.startReservation(reservation);
      console.log(res)

      reservation = {
        id: res.id,
        reservationDate: new Date(),
        managerId: localStorage.getItem('userId'),          
        client: client,
        tour: tour,
        flightTo: null,
        flightFrom: null,
        hotel: null,
        indicateTransfer: null,
        indicateInsurance: null,
        paymentType: null,
        insuranceType: null
      }

      navigate("/flights", { 
        state: { 
          tour: tour, 
          client: client, 
          reservation: reservation,
          reservationProcess: reservationProcess, 
        } 
      });
    }
    else {
      navigate(`/client`, { state: { client: client } });
    }
  };

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
          </>
        ) : (
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
                value={searchClientName}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="search-button-wrapper">
              <button 
                onClick={() => {
                  setClients([]);
                  currentPageRef.current = 0;
                  setFetching(true);
                }} 
                className="search-button"
              >
                Найти
              </button>
            </div>
          </div>
        </div>

        <div className="clients-list">
          {isLoading && clients.length === 0 ? (
            <div className="loading-state">Загрузка клиентов...</div>
          ) : clients.length > 0 ? (
            <>
              {clients.map((client) => (
                <СlientCard
                  key={client.id}
                  client={client}
                  onClick={() => handleClientClick(client)}
                />
              ))}
              {isLoading && clients.length > 0 && (
                <div className="loading-more">Загрузка еще...</div>
              )}
            </>
          ) : (
            <div className="empty-state">
              {searchClientName 
                ? "Нет клиентов, соответствующих вашему запросу."
                : "Нет зарегистрированных клиентов."}
            </div>
          )}
        </div>
        
        {!isLoading && clients.length > 0 && clients.length >= totalCount && totalCount > 0 && (
          <div className="end-of-list">Конец списка</div>
        )}
      </main>
    </div>
  );
}