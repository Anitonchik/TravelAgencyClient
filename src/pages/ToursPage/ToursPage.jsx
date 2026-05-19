import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TourCard from "../../components/Tour/Tour";
import "./ToursPage.css";
import Tour from "../../client/TourRq";

export default function ToursPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationProcess = location.state?.reservationProcess;
  const client = location.state?.client;
  
  const [tours, setTours] = useState([]);
  const currentPageRef = useRef(0);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 15;
  
  const [searchHotel, setSearchHotel] = useState("");
  const [searchDirection, setSearchDirection] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  
  const tourApi = useMemo(() => new Tour(), []);
  const searchTimeoutRef = useRef(null);

  // Загрузка туров с учетом всех фильтров
  const loadTours = useCallback(async (pageNum, resetList = false) => {
    setIsLoading(true);
    try {
      let data;

      if (searchHotel) {
        data = await tourApi.getByHotelName(searchHotel, pageNum, pageSize);
      } 
      else if (searchDirection) {
        data = await tourApi.getByDirection(searchDirection, pageNum, pageSize);
      }
      else if (checkInDate && checkOutDate) {
        data = await tourApi.getByDates(checkInDate, checkOutDate, pageNum, pageSize);
      }
      else if (checkInDate) {
        data = await tourApi.getByDate(checkInDate, pageNum, pageSize);
      }
      else if (priceFrom && priceTo) {
        data = await tourApi.getByPriceRange(priceFrom, priceTo, pageNum, pageSize);
      }
      else if (priceFrom) {
        data = await tourApi.getByPriceFrom(priceFrom, pageNum, pageSize);
      }
      else if (priceTo) {
        data = await tourApi.getByPriceTo(priceTo, pageNum, pageSize);
      }
      else {
        data = await tourApi.getAll(pageNum, pageSize);
      }
      
      const toursArray = data.content || data;
      
      if (resetList) {
        setTours(toursArray);
      } else {
        setTours(prev => [...prev, ...toursArray]);
      }
      
      setTotalCount(data.totalElements || toursArray.length);
      return data;
    } catch (error) {
      console.error("Ошибка при загрузке туров:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [tourApi, searchHotel, searchDirection, checkInDate, checkOutDate, priceFrom, priceTo, pageSize]);

  const resetAndSearch = () => {
    setTours([]);
    currentPageRef.current = 0;
    setFetching(true);
  };

  const handleHotelChange = (value) => {
    setSearchHotel(value);
    setSearchDirection("");
    setPriceFrom("");
    setPriceTo("");
    setCheckInDate("");
    setCheckOutDate("");
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(resetAndSearch, 300);
  };

  const handleDirectionChange = (value) => {
    setSearchDirection(value);
    setSearchHotel("");
    setPriceFrom("");
    setPriceTo("");
    setCheckInDate("");
    setCheckOutDate("");
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(resetAndSearch, 300);
  };

  const handlePriceFromChange = (value) => {
    setPriceFrom(value);
    setSearchHotel("");
    setSearchDirection("");
    setCheckInDate("");
    setCheckOutDate("");
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(resetAndSearch, 300);
  };

  const handlePriceToChange = (value) => {
    setPriceTo(value);
    setSearchHotel("");
    setSearchDirection("");
    setCheckInDate("");
    setCheckOutDate("");
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(resetAndSearch, 300);
  };

  const handleDateChange = (type, value) => {
    if (type === 'start') {
      setCheckInDate(value);
    } else {
      setCheckOutDate(value);
    }
    setSearchHotel("");
    setSearchDirection("");
    setPriceFrom("");
    setPriceTo("");
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(resetAndSearch, 300);
  };

  useEffect(() => {
    setTours([]);
    currentPageRef.current = 0;
    setFetching(true);
  }, [searchHotel, searchDirection, priceFrom, priceTo, checkInDate, checkOutDate]);

  useEffect(() => {
    if (!fetching) return;
    
    const loadMore = async () => {
      const pageToLoad = currentPageRef.current;
      const data = await loadTours(pageToLoad, pageToLoad === 0);
      
      if (data && data.content && data.content.length > 0) {
        currentPageRef.current += 1;
      }
      setFetching(false);
    };
    
    loadMore();
  }, [fetching, loadTours]);

  // Обработчик скролла
  const scrollHandler = useCallback((e) => {
    const scrollHeight = e.target.documentElement.scrollHeight;
    const scrollTop = e.target.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    if (scrollHeight - (scrollTop + windowHeight) < 100 
        && tours.length < totalCount 
        && !fetching 
        && !isLoading) {
      setFetching(true);
    }
  }, [tours.length, totalCount, fetching, isLoading]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return () => {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleTourClick = (tour) => {
    if (reservationProcess) {
      navigate("/tour", { state: { tour: tour, client: client, reservationProcess: reservationProcess } });
    } else {
      navigate("/tour", { state: { tour: tour, reservationProcess: reservationProcess } });
    }
  };

  // Определяем, есть ли блок с информацией о клиенте
  const hasClientInfo = reservationProcess && client;

  return (
    <div className="tours-selection">
      <div className={`tours-container ${!hasClientInfo ? 'no-client-info' : ''}`}>
        {/* Блок информации о клиенте - отображается только если есть */}
        {hasClientInfo && (
          <aside className="sidebar-tours-page client-info-sidebar">
            <div className="client-info-card">
              <h2 className="client-info-title">
                Информация о клиенте
              </h2>
              <div className="client-info-content">
                <div>
                  <p className="info-label">
                    Клиент
                  </p>
                  <p className="info-value">
                    {client?.lastName + " " + client?.firstName + " " + client?.surName || "Имя клиента"}
                  </p>
                </div>
                <div className="divider" />
                <div>
                  <p className="info-label">
                    Предпочтения
                  </p>
                  <p className="preferences-text">
                    {client?.preferenceDescription || "Не указаны"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        )}
        
        {/* Основной контент (туры) */}
        <main className="main-content">
          <div>
            <h1 className="page-title">
              Подбор туров
            </h1>
            <p className="page-subtitle">
              Выберите подходящий тур для клиента
            </p>

            {/* Результаты поиска */}
            {isLoading && tours.length === 0 ? (
              <div className="loading-state">Загрузка туров...</div>
            ) : tours.length > 0 ? (
              <>
                <div className="tours-list">
                  {tours.map((tour) => (
                    <TourCard 
                      key={tour.id} 
                      tour={tour} 
                      onClick={() => handleTourClick(tour)}
                    />
                  ))}
                </div>
                {isLoading && tours.length > 0 && (
                  <div className="loading-more">Загрузка еще...</div>
                )}
                {!isLoading && tours.length >= totalCount && totalCount > 0 && (
                  <div className="end-of-list">Конец списка</div>
                )}
              </>
            ) : (
              <div className="empty-state">
                {searchHotel || searchDirection || priceFrom || priceTo || checkInDate || checkOutDate
                  ? "Нет туров, соответствующих вашим критериям."
                  : "Нет доступных туров."}
              </div>
            )}
          </div>
        </main>

        {/* Фильтры туров - всегда справа */}
        <aside className="sidebar-tours-page filters-sidebar">
          <div className="filters-card">
            <h3 className="filters-title">Фильтры туров</h3>
            
            <div className="filter-group">
              <label className="filter-label">Название отеля</label>
              <input
                type="text"
                placeholder="Введите название отеля"
                value={searchHotel}
                onChange={(e) => handleHotelChange(e.target.value)}
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Направление (город)</label>
              <input
                type="text"
                placeholder="Страна, город"
                value={searchDirection}
                onChange={(e) => handleDirectionChange(e.target.value)}
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Цена (₽)</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="от"
                  value={priceFrom}
                  onChange={(e) => handlePriceFromChange(e.target.value)}
                  className="filter-input price-input"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  placeholder="до"
                  value={priceTo}
                  onChange={(e) => handlePriceToChange(e.target.value)}
                  className="filter-input price-input"
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Даты</label>
              <div className="date-range">
                <input
                  type="date"
                  placeholder="С"
                  value={checkInDate}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="filter-input"
                />
                <input
                  type="date"
                  placeholder="До"
                  value={checkOutDate}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>
            
            <button 
              onClick={() => {
                setSearchHotel("");
                setSearchDirection("");
                setPriceFrom("");
                setPriceTo("");
                setCheckInDate("");
                setCheckOutDate("");
                setTours([]);
                currentPageRef.current = 0;
                setFetching(true);
              }}
              className="clear-filters-button"
            >
              Очистить все фильтры
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}