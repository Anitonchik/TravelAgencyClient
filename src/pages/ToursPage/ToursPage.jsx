import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TourCard from "../../components/Tour/Tour";
import { CITIES } from "../../constants/cities";
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
  
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [useClientPreferences, setUseClientPreferences] = useState(false);
  
  const tourApi = useMemo(() => new Tour(), []);
  const searchTimeoutRef = useRef(null);

  const filteredCities = CITIES.filter(city => 
    city.label.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
    city.value.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  const loadTours = useCallback(async (pageNum, resetList = false) => {
    setIsLoading(true);
    try {
      let data;

      const hasFilters = searchHotel || searchDirection || priceFrom || priceTo || checkInDate || checkOutDate;

      if (useClientPreferences && client) {
        data = await tourApi.getByClientPreferencies(client.id, pageNum, pageSize);
      } else if (hasFilters) {
        const params = new URLSearchParams();
        if (searchHotel) params.append('hotelName', searchHotel);
        if (searchDirection) params.append('direction', searchDirection);
        if (priceFrom) params.append('priceFrom', priceFrom);
        if (priceTo) params.append('priceTo', priceTo);
        if (checkInDate) params.append('dateFrom', checkInDate);
        if (checkOutDate) params.append('dateTo', checkOutDate);
        params.append('pageNumber', pageNum);
        params.append('pageSize', pageSize);
        
        data = await tourApi.searchTours(params);
      } else {
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
  }, [tourApi, searchHotel, searchDirection, checkInDate, checkOutDate, priceFrom, priceTo, pageSize, client, useClientPreferences]);

  const applyPreferencesFilter = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setUseClientPreferences(true);
    setSearchHotel("");
    setSearchDirection("");
    setPriceFrom("");
    setPriceTo("");
    setCheckInDate("");
    setCheckOutDate("");
    
    setTours([]);
    currentPageRef.current = 0;
    setFetching(true);
  }, []);

  const handleHotelChange = useCallback((value) => {
    setUseClientPreferences(false);
    setSearchHotel(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setTours([]);
      currentPageRef.current = 0;
      setFetching(true);
    }, 300);
  }, []);

  const handleDirectionSelect = useCallback((value) => {
    setUseClientPreferences(false);
    setSearchDirection(value);
    setIsCityModalOpen(false);
    setCitySearchTerm("");
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setTours([]);
      currentPageRef.current = 0;
      setFetching(true);
    }, 300);
  }, []);

  const handlePriceFromChange = useCallback((value) => {
    setUseClientPreferences(false);
    setPriceFrom(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setTours([]);
      currentPageRef.current = 0;
      setFetching(true);
    }, 300);
  }, []);

  const handlePriceToChange = useCallback((value) => {
    setUseClientPreferences(false);
    setPriceTo(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setTours([]);
      currentPageRef.current = 0;
      setFetching(true);
    }, 300);
  }, []);

  const handleDateChange = useCallback((type, value) => {
    setUseClientPreferences(false);
    if (type === 'start') {
      setCheckInDate(value);
    } else {
      setCheckOutDate(value);
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setTours([]);
      currentPageRef.current = 0;
      setFetching(true);
    }, 300);
  }, []);

  const clearAllFilters = useCallback(() => {
    setUseClientPreferences(false);
    setSearchHotel("");
    setSearchDirection("");
    setPriceFrom("");
    setPriceTo("");
    setCheckInDate("");
    setCheckOutDate("");
    setTours([]);
    currentPageRef.current = 0;
    setFetching(true);
  }, []);

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

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleTourClick = useCallback((tour) => {
    if (reservationProcess) {
      navigate("/tour", { state: { tour: tour, client: client, reservationProcess: reservationProcess } });
    } else {
      navigate("/tour", { state: { tour: tour, reservationProcess: reservationProcess } });
    }
  }, [navigate, reservationProcess, client]);

  const hasClientInfo = reservationProcess && client;
  const selectedCityLabel = CITIES.find(city => city.value === searchDirection)?.label || "Выберите город";

  return (
    <div className="tours-selection">
      <div className={`tours-container ${!hasClientInfo ? 'no-client-info' : ''}`}>
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
                    {`${client?.lastName || ''} ${client?.firstName || ''} ${client?.surName || ''}`.trim() || "Имя клиента"}
                  </p>
                </div>
                
                <div className="divider" />
                
                <div>
                  <p className="info-label">
                    Предпочтения
                  </p>
                  
                  <div className="preference-item">
                    <span className="preference-label">Город:</span>
                    <span className="preference-value">
                      {CITIES.find(city => city.value === client?.preferenceCity)?.label || "Не указан"}
                    </span>
                  </div>
                  
                  <div className="preference-item">
                    <span className="preference-label">Дата:</span>
                    <span className="preference-value">
                      {client?.preferenceDateFrom 
                        ? new Date(client.preferenceDateFrom).toLocaleDateString('ru-RU') 
                        : "Не указана"}
                    </span>
                  </div>
                  
                  <div className="preference-item">
                    <span className="preference-label">Цена от:</span>
                    <span className="preference-value">
                      {client?.preferencePriceFrom 
                        ? `${client.preferencePriceFrom.toLocaleString()} ₽` 
                        : "Не указана"}
                    </span>
                  </div>
                  
                  <div className="preference-item">
                    <span className="preference-label">Цена до:</span>
                    <span className="preference-value">
                      {client?.preferencePriceTo 
                        ? `${client.preferencePriceTo.toLocaleString()} ₽` 
                        : "Не указана"}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={applyPreferencesFilter}
                  className="buttons"
                >
                  Применить фильтр по предпочтениям
                </button>
              </div>
            </div>
          </aside>
        )}
        
        <main className="main-content">
          <div>
            <h1 className="page-title">
              Подбор туров
            </h1>
            <p className="page-subtitle">
              Выберите подходящий тур для клиента
            </p>

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
                {useClientPreferences 
                  ? "Нет туров, соответствующих предпочтениям клиента."
                  : (searchHotel || searchDirection || priceFrom || priceTo || checkInDate || checkOutDate
                    ? "Нет туров, соответствующих вашим критериям."
                    : "Нет доступных туров.")}
              </div>
            )}
          </div>
        </main>

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
              <div className="city-selector" onClick={() => setIsCityModalOpen(true)}>
                <span className={`city-selector-value ${!searchDirection ? 'placeholder' : ''}`}>
                  {selectedCityLabel}
                </span>
                <span className="city-selector-arrow">▼</span>
              </div>
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
              onClick={clearAllFilters}
              className="buttons"
            >
              Очистить все фильтры
            </button>
          </div>
        </aside>
      </div>

      {isCityModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCityModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Выберите город</h3>
              <button className="modal-close" onClick={() => setIsCityModalOpen(false)}>×</button>
            </div>
            
            <div className="modal-search">
              <input
                type="text"
                placeholder="Поиск города..."
                value={citySearchTerm}
                onChange={(e) => setCitySearchTerm(e.target.value)}
                className="modal-search-input"
                autoFocus
              />
            </div>
            
            <div className="modal-cities-list">
              {filteredCities.length > 0 ? (
                filteredCities.map(city => (
                  <div
                    key={city.value}
                    className={`modal-city-item ${searchDirection === city.value ? 'selected' : ''}`}
                    onClick={() => handleDirectionSelect(city.value)}
                  >
                    <span className="modal-city-name">{city.label}</span>
                  </div>
                ))
              ) : (
                <div className="modal-no-results">
                  Ничего не найдено
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}