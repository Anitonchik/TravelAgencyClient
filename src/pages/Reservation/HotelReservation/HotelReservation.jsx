import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HotelReservation.css";
import HotelCard from "../../../components/Hotel/Hotel";

export default function HotelReservation() {
  console.log
  const navigate = useNavigate();
  const location = useLocation();
  
  // Получаем данные из состояния
  const reservationProcess = location.state?.reservationProcess;
  const client = location.state?.client;
  const tour = location.state?.tour;
  const reservation = location.state?.reservation;

  // Состояния
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Получаем отели из тура
  const tourHotels = tour?.hotels || [];
  console.log("Отели в туре:", tourHotels);

  // Проверка на наличие отелей в туре
  const hasHotels = tourHotels.length > 0;

  // Эффект для фильтрации отелей при поиске
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

  // Функция поиска отелей
  const searchHotels = async () => {
    if (!searchQuery.trim()) {
      alert("Введите название отеля или локацию для поиска");
      return;
    }

    setLoading(true);
    setSearchPerformed(true);
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/hotels/search?query=${encodeURIComponent(searchQuery)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Ошибка при поиске отелей");
      }
      
      const data = await response.json();
      setHotels(data);
      setFilteredHotels(data);
    } catch (error) {
      console.error("Ошибка поиска:", error);
      alert("Не удалось выполнить поиск. Попробуйте позже.");
      setHotels([]);
      setFilteredHotels([]);
    } finally {
      setLoading(false);
    }
  };

  // Выбор отеля
  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
  };

  // Расчет общей стоимости
  const totalPrice = selectedHotel?.price || 0;

  // Проверка возможности продолжить
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
        {/* Информация о клиенте */}
        <p className="client-info">
          Выбор отеля для клиента {client?.lastName} {client?.firstName} {client?.surName}
        </p>

        {/* Название тура */}
        <div className="tour-pill">
          <span className="tour-name">
            {tour?.name}
          </span>
        </div>

        {/* Основная карточка отелей */}
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

            {/* Результаты поиска */}
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

          {/* Блок отелей из тура */}
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

          {/* Поиск дополнительных отелей */}
          

          {/* Итоговая информация */}
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
          
          {/* Предупреждение об отсутствии отелей */}
          {(!hasHotels) && (
            <div className="warning-message">
              Невозможно забронировать отель: отсутствуют доступные отели в туре
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="button button-cancel"
          >
            Отменить
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className={`button button-continue ${!canContinue ? "button-disabled" : ""}`}
          >
            Продолжить
          </button>
        </div>
      </main>
    </div>
  );
}