import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ReservationsMain.css";
import ReservationCard from "../../components/Reservation/Reservation";
import Reservation from "../../client/ReservationRq";
import Client from "../../client/ClientRq";

const STATUS_FILTERS = [
  { label: "Все", value: "ALL" },
  { label: "Подтверждено", value: "CONFIRMED" },
  { label: "Ожидает", value: "EXPECTATION" },
  { label: "Отменено", value: "CANCELED" },
]

export default function ReservationsMain() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const currentPageRef = useRef(0);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [countsOfReservations, setCountsOfReservations] = useState({
    ALL: 0,
    CONFIRMED: 0,
    EXPECTATION: 0,
    CANCELED: 0
  });
  const pageSize = 2;

  const [filter, setFilter] = useState("ALL");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientsList, setShowClientsList] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [searchClientName, setSearchClientName] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  
  // Состояния для модального окна клиентов
  const [clientsSearch, setClientsSearch] = useState("");
  const [clientsPage, setClientsPage] = useState(0);
  const [clientsTotalPages, setClientsTotalPages] = useState(0);
  const [clientsTotalElements, setClientsTotalElements] = useState(0);
  const clientsPageSize = 5;
  
  // Таймер для поиска
  const searchTimeoutRef = useRef(null);
  const clientsSearchTimeoutRef = useRef(null);
  
  const reservationApi = useMemo(() => new Reservation(), []);
  const clientApi = useMemo(() => new Client(), []);

  const [selected, setSelected] = useState(null);
  

  useEffect(() => {
    reservationApi.getCounts()
      .then(data => {
        setTotalCount(data.ALL);
        setCountsOfReservations(data);
      })
      .catch(error => console.error("Ошибка при получении количества бронирований:", error));
  }, []);

  // Загрузка клиентов для модального окна с поиском и пагинацией
  const loadClients = async (page, search) => {
    setIsLoadingClients(true);
    try {
      let data;
      if (search.trim()) {
        data = await clientApi.getByClientName(search, page, clientsPageSize);
      } else {
        data = await clientApi.getAll(page, clientsPageSize);
      }
      const clientsArray = data.content || data;
      setClients(clientsArray);
      setClientsTotalPages(data.totalPages || 0);
      setClientsTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error("Ошибка загрузки клиентов:", error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  
  const handleOpenClients = () => {
    setShowClientsList(true);
    setClientsPage(0);
    setClientsSearch("");
    loadClients(0, "");
  };

  const handleClientsSearchChange = (value) => {
    setClientsSearch(value);
    setClientsPage(0);
    
    if (clientsSearchTimeoutRef.current) {
      clearTimeout(clientsSearchTimeoutRef.current);
    }
    
    clientsSearchTimeoutRef.current = setTimeout(() => {
      loadClients(0, value);
    }, 300);
  };

  const handleClientsPageChange = (newPage) => {
    setClientsPage(newPage);
    loadClients(newPage, clientsSearch);
  };

  const handleStatusFilter = (value) => {
    setFilter(value);
    setSelectedClient(null);
    setSearchClientName("");
    setCheckInDate("");
    setCheckOutDate("");
    setReservations([]);
    currentPageRef.current = 0;
    setFetching(true);
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setSearchClientName("");
    setCheckInDate("");
    setCheckOutDate("");
    setFilter("ALL");
    setShowClientsList(false);
    setReservations([]);
    currentPageRef.current = 0;
    setFetching(true);
  };

  const handleClearClient = () => {
    setSelectedClient(null);
    setReservations([]);
    currentPageRef.current = 0;
    setFetching(true);
  };

  const performSearchByName = useCallback(() => {
    if (searchClientName.trim()) {
      setSelectedClient(null);
      setFilter("ALL");
      setCheckInDate("");
      setCheckOutDate("");
      setReservations([]);
      currentPageRef.current = 0;
      setFetching(true);
    }
  }, [searchClientName]);

  const handleSearchInputChange = (value) => {
    setSearchClientName(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        performSearchByName();
      }
    }, 300);
  };

  const handleDateChange = (type, value) => {
    setSelectedClient(null);
    setFilter("ALL");
    setSearchClientName("");
    
    if (type === 'start') {
      setCheckInDate(value);
    } else {
      setCheckOutDate(value);
    }
    
    setReservations([]);
    currentPageRef.current = 0;
    setFetching(true);
  };

  const handleDateFilter = () => {
    if (checkInDate || checkOutDate) {
      setSelectedClient(null);
      setFilter("ALL");
      setSearchClientName("");
      setReservations([]);
      currentPageRef.current = 0;
      setFetching(true);
    }
  };

  const handleSearchClick = () => {
    if (searchClientName) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      performSearchByName();
    } else if (checkInDate || checkOutDate) {
      handleDateFilter();
    }
  };

  useEffect(() => {
    if (!fetching) return;

    if (fetching) {
      const loadData = async () => {
        try {
          let data;
          
          if (selectedClient) {
            console.log("Загрузка бронирований для клиента:", selectedClient);
            data = await reservationApi.getByClientId(selectedClient.id, currentPageRef.current, pageSize);
          } 
          else if (searchClientName) {
            data = await reservationApi.getByClientName(searchClientName, currentPageRef.current, pageSize);
          }
          else if (checkInDate && checkOutDate) {
            data = await reservationApi.getByDates(checkInDate, checkOutDate, currentPageRef.current, pageSize);
          }
          else if (checkInDate) {
            data = await reservationApi.getByDate(checkInDate, currentPageRef.current, pageSize);
          }
          else if (filter !== "ALL") {
            data = await reservationApi.getByStatus(filter, currentPageRef.current, pageSize);
          } 
          else {
            data = await reservationApi.getAll(currentPageRef.current, pageSize);
          }
          
          setReservations(prev => [...prev, ...data.content]);
          console.log(reservations);
          currentPageRef.current += 1;
          setTotalCount(data.totalElements);
        } catch (error) {
          console.error("Ошибка при загрузке бронирований:", error);
        } finally {
          setFetching(false);
        }
      };
      
      loadData();
    }
  }, [fetching, filter, selectedClient, searchClientName, checkInDate, checkOutDate]);

  useEffect(() => {
    setReservations([]);
    currentPageRef.current = 0;
    setFetching(true);
  }, [filter, selectedClient, searchClientName, checkInDate, checkOutDate]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => {      
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [reservations, totalCount]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (clientsSearchTimeoutRef.current) {
        clearTimeout(clientsSearchTimeoutRef.current);
      }
    };
  }, []);

  const handleReservationClick = (reservation) => {
    setSelected(reservation);
    navigate(`/reservation`, { state: { reservation: reservation } });
  };

  const getStatusPillClass = (status) => {
    const classes = {
      CONFIRMED: "status-pill-CONFIRMED",
      EXPECTATION: "status-pill-EXPECTATION",
      CANCELED: "status-pill-CANCELED"
    };
    return classes[status] || "";
  };

  const scrollHandler = (e) => {
    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100
      && reservations.length < totalCount) {
      setFetching(true);
    }
  };
  
  return (
    <div className="bookings-container">

      <main className="bookings-main">
        <div className="start-reservation-button-container">
          <button
            onClick={() => navigate("/clients", { state: { reservationProcess: true } })}
            className="start-reservation-button"
          >
            Начать бронирование тура
          </button>
        </div>

        <div className="page-header">
          <h1 className="page-title">
            Бронирования
          </h1>
        </div>

        {selectedClient && (
          <div className="selected-client-banner">
            <div className="selected-client-info">
              <span className="selected-client-label">Фильтр по клиенту:</span>
              <span className="selected-client-name">{selectedClient.lastName} {selectedClient.firstName} {selectedClient.surName}</span>
              {selectedClient.email && <span className="selected-client-email">{selectedClient.email}</span>}
            </div>
            <button onClick={handleClearClient} className="clear-client-btn">
              Очистить
            </button>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card stat-card-ALL">
            <p className="stat-count">{countsOfReservations.ALL}</p>
            <p className="stat-label">Всего</p>
          </div>
          <div className="stat-card stat-card-CONFIRMED">
            <p className="stat-count">{countsOfReservations.CONFIRMED}</p>
            <p className="stat-label">Подтверждено</p>
          </div>
          <div className="stat-card stat-card-EXPECTATION">
            <p className="stat-count">{countsOfReservations.EXPECTATION}</p>
            <p className="stat-label">Ожидает</p>
          </div>
          <div className="stat-card stat-card-CANCELED">
            <p className="stat-count">{countsOfReservations.CANCELED}</p>
            <p className="stat-label">Отменено</p>
          </div>
        </div>

        <div className="search-container">
          <div className="search-form">
            <div className="search-field">
              <label className="search-label">Клиент</label>
              <input
                type="text"
                placeholder="ФИО клиента"
                value={searchClientName}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="search-field-date">
              <label className="search-label">С</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="search-field-date">
              <label className="search-label">До</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => {
                  setCheckOutDate(e.target.value);
                  if (checkInDate || e.target.value) {
                    handleDateFilter();
                  }
                }}
                className="search-input"
              />
            </div>
            
            <div className="search-button-wrapper">
              <button onClick={handleSearchClick} className="search-button">Найти</button>
            </div>
          </div>
        </div>

        <div className="d-flex flex-row ">
          <div className="filters-container">
            {STATUS_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleStatusFilter(value)}
                className={`filter-chip ${filter === value ? "filter-chip-active" : "filter-chip-inactive"}`}
              >
                {label}
                {value !== "ALL" && (
                  <span className={`filter-badge ${filter === value ? "filter-badge-active" : getStatusPillClass(value)}`}>
                    {countsOfReservations[value]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenClients}
            className="filters-container clients-button"
          >
            Клиенты
          </button>
        </div>

        <div className="bookings-list">
          {reservations.length > 0 ? (
            reservations.map((booking) => (
              <ReservationCard
                key={booking.id}
                dto={booking}
                selected={selected?.id === booking.id}
                onClick={() => handleReservationClick(booking)}
              />
            ))
          ) : (
            <div className="empty-state">
              {selectedClient 
                ? `У клиента ${selectedClient.firstName} ${selectedClient.lastName} ${selectedClient.surName} нет бронирований`
                : "Нет бронирований в этой категории."}
            </div>
          )}
        </div>
      </main>

      {/* Модальное окно со списком клиентов с поиском и пагинацией */}
      {showClientsList && (
        <div className="modal-overlay" onClick={() => setShowClientsList(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Выберите клиента</h2>
              <button className="modal-close" onClick={() => setShowClientsList(false)}>✕</button>
            </div>
            <div className="modal-body">
              {/* Поиск клиентов */}
              <div className="clients-search-container">
                <input
                  type="text"
                  placeholder="Поиск клиента по имени..."
                  value={clientsSearch}
                  onChange={(e) => handleClientsSearchChange(e.target.value)}
                  className="clients-search-input"
                />
              </div>
              
              {/* Список клиентов */}
              {isLoadingClients ? (
                <div className="loading-clients">Загрузка клиентов...</div>
              ) : clients.length > 0 ? (
                <>
                  <div className="clients-list">
                    {clients.map(client => (
                      <div 
                        key={client.id} 
                        className="client-item"
                        onClick={() => handleSelectClient(client)}
                      >
                        <div className="client-details">
                          <div className="client-name">{client.lastName} {client.firstName} {client.surName}</div>
                          {client.email && <div className="client-email">{client.email}</div>}
                          {client.phone && <div className="client-phone">{client.phone}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Пагинация */}
                  {clientsTotalPages > 1 && (
                    <div className="pagination-container">
                      <button
                        onClick={() => handleClientsPageChange(clientsPage - 1)}
                        disabled={clientsPage === 0}
                        className="pagination-button"
                      >
                        ← Назад
                      </button>
                      <span className="pagination-info">
                        Страница {clientsPage + 1} из {clientsTotalPages}
                      </span>
                      <button
                        onClick={() => handleClientsPageChange(clientsPage + 1)}
                        disabled={clientsPage + 1 >= clientsTotalPages}
                        className="pagination-button"
                      >
                        Вперед →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-clients">
                  {clientsSearch ? "Клиенты не найдены" : "Нет зарегистрированных клиентов"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}