import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HotelReservation.css";
import HotelCard from "../../../components/Hotel/Hotel";

export default function HotelReservation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const reservationProcess = location.state?.reservationProcess;
  const client = location.state?.client;
  const tour = location.state?.tour;
  const reservation = location.state?.reservation;

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const tourHotels = tour?.hotels || [];
  const hasHotels = tourHotels.length > 0;

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHotels(hotels);
    } else {
      const filtered = hotels.filter(hotel =>
        hotel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHotels(filtered);
    }
  }, [searchQuery, hotels]);

  const searchHotels = () => {
    if (!searchQuery.trim()) {
      alert("Введите название отеля или локацию для поиска");
      return;
    }

    setLoading(true);
    setSearchPerformed(true);
    
    try {
      const allHotels = [];
      
      tourHotels.forEach(tourHotel => {
        if (!allHotels.some(h => h.id === tourHotel.id)) {
          allHotels.push(tourHotel);
        }
      });
      
      tour?.availableHotels?.forEach(availableHotel => {
        if (!allHotels.some(h => h.id === availableHotel.id)) {
          allHotels.push(availableHotel);
        }
      });
      
      const filtered = allHotels.filter(hotel =>
        hotel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setHotels(filtered);
      setFilteredHotels(filtered);
    } catch (error) {
      console.error("Ошибка фильтрации:", error);
      alert("Не удалось выполнить поиск");
      setHotels([]);
      setFilteredHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
  };

  const totalPrice = selectedHotel?.price || 0;

  const canContinue = hasHotels && selectedHotel;

  const handleContinue = async () => {
    if (reservationProcess) {
      reservation.hotel = selectedHotel;

      navigate("/summary-reservation", {
                state: { 
                  tour: tour, 
                  client: client, 
                  reservation: reservation,
                  reservationProcess: reservationProcess, 
                }
              }); 
    }
  }

  return (
    <div className="hotel-booking">
      <main className="hotel-main">
        <p className="client-info">
          Выбор отеля для клиента {client?.lastName} {client?.firstName} {client?.surName}
        </p>

        <div className="tour-pill">
          <span className="tour-name">
            {tour?.name}
          </span>
        </div>

        <div className="hotels-card">
          <h2 className="hotels-title">Отели</h2>

          <section className="hotels-section">
            <p className="hotel-route">
              Поиск других отелей
            </p>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Введите название отеля или город..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchHotels()}
              />
              <button
                type="button"
                className="search-button"
                onClick={searchHotels}
                disabled={loading}
              >
                {loading ? "Поиск..." : "Найти"}
              </button>
            </div>

            {searchPerformed && (
              <div className="search-results">
                {loading ? (
                  <div className="loading-message">Загрузка...</div>
                ) : filteredHotels.length > 0 ? (
                  <div className="hotels-grid">
                    {filteredHotels.map((hotel) => (
                      <HotelCard
                        key={hotel.id}
                        hotel={hotel}
                        selected={selectedHotel?.id === hotel.id}
                        onSelect={() => handleSelectHotel(hotel)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="no-flights-message">
                    По вашему запросу ничего не найдено
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="hotels-section">
            <p className="hotel-route">
              Доступные отели в туре
            </p>
            {hasHotels ? (
              <div className="hotels-grid">
                {tourHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    selected={selectedHotel?.id === hotel.id}
                    onSelect={() => handleSelectHotel(hotel)}
                  />
                ))}
              </div>
            ) : (
              <div className="no-hotels-message">
                Нет доступных отелей в туре
              </div>
            )}
          </section>

          <div className="divider" />
          {selectedHotel && (
            <div className="summary">
              <span className="summary-route">
                {selectedHotel.name} · {selectedHotel.location} · {selectedHotel.foodType}
              </span>
              <span className="summary-price">
                Итого: {totalPrice.toLocaleString()} RUB
              </span>
            </div>
          )}
          
          {(!hasHotels) && (
            <div className="warning-message">
              Невозможно забронировать отель: отсутствуют доступные отели в туре
            </div>
          )}
        </div>

        <div className="actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="button-hotel button-cancel-hotel "
          >
            Отменить
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className={`button-hotel button-continue-hotel ${!canContinue ? "button-disabled-hotel" : ""}`}
          >
            Продолжить
          </button>
        </div>
      </main>
    </div>
  );
}