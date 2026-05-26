import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ReservationDetailsPage.css";
import TourCard from "../../components/Tour/Tour";
import FlightCard from "../../components/Flight/Flight";
import HotelCard from "../../components/Hotel/Hotel";
import Reservation from "../../client/ReservationRq";

const InsuranceTypes = {
  MED: "Медицинская страховка",
  AII: "Страхование от несчастных случаев",
  CANC: "Страхование отмены поездки",
  CL: "Страхование гражданской ответственности",
  BAG: "Страхование багажа",
  NO: "Нет"
};

export default function ReservationDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationApi = useMemo(() => new Reservation(), []);
  
  const [reservation, setReservation] = useState(location.state?.reservation);
  const [loading, setLoading] = useState(!location.state?.reservation);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); 

  const isReservationComplete = () => {
    return reservation?.flightTo && 
           reservation?.flightFrom && 
           reservation?.hotel;
  };

  const handleContinueReservation = () => {
    const newReservation = {
      id: reservation.id,
      reservationDate: new Date(),
      managerId: reservation.manager.id,             
      client: reservation.client,
      tour: reservation.tour,
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
        reservationProcess: true,
        client: reservation?.client,
        tour: reservation?.tour,
        reservation: newReservation
      }
    });
  };

  const handleViewVoucher = () => {
    navigate("/voucher", {
      state: {
        reservation: reservation,
        client: reservation?.client,
        tour: reservation?.tour,
        selectedOutbound: reservation?.flightTo,
        selectedReturn: reservation?.flightFrom,
        selectedHotel: reservation?.hotel
      }
    });
  };

  const handleCancelReservation = async () => {
    console.log(reservation)
    
    const reservationData = {
      id: reservation.id,
      reservationDate: reservation.reservationDate,
      dateOfIssueOfTheVoucher: new Date().toISOString(),
      managerId: reservation.manager.id,
      clientId: reservation.client.id,
      tourId: reservation.tour.id,
      flightToId: reservation.flightTo.id,
      flightFromId: reservation.flightFrom.id,
      hotelId: reservation.hotel.id,
      indicateTransfer: false,
      indicateInsurance: false,
      paymentType: "CASH",
      insuranceType: "NO"
    };
    await reservationApi.cancel(reservationData);

  }

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Дата не указана";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Неверная дата";
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
      });
    } catch {
      return "Ошибка даты";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "Дата не указана", time: "Время не указано" };
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { date: "Неверная дата", time: "Неверное время" };
      return {
        date: date.toLocaleDateString("ru-RU"),
        time: date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
      };
    } catch {
      return { date: "Ошибка даты", time: "Ошибка времени" };
    }
  };

  const formatPrice = (price) => {
    const numPrice = price ? parseInt(price) : 0;
    return `${numPrice.toLocaleString()} RUB`;
  };

  const getInsuranceText = (insuranceType) => {
    return InsuranceTypes[insuranceType] || InsuranceTypes.NO;
  };

  if (loading) {
    return (
      <div className="reservation-details-page">
        <main className="reservation-details-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка информации о бронировании...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="reservation-details-page">
        <main className="reservation-details-main">
          <div className="error-container">
            <p>Бронирование не найдено</p>
            <button onClick={handleBack} className="button-back">
              Вернуться назад
            </button>
          </div>
        </main>
      </div>
    );
  }

  const flightToData = reservation.flightTo ? formatDateTime(reservation.flightTo.date) : null;
  const flightFromData = reservation.flightFrom ? formatDateTime(reservation.flightFrom.date) : null;

  return (
    <div className="reservation-details-page">
      <main className="reservation-details-main">
        <h1 className="reservation-details-title">
          Детали бронирования #{reservation.id}
        </h1>

        <div className="reservation-details-card">
          {/* Информация о менеджере и клиенте */}
          <div className="details-section">
            <h2 className="section-title">Информация о участниках</h2>
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Менеджер:</span>
                <span className="detail-value">
                  {reservation.manager?.lastName} {reservation.manager?.firstName} {reservation.manager?.surName}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Клиент:</span>
                <span className="detail-value">
                  {reservation.client?.lastName} {reservation.client?.firstName} {reservation.client?.surName}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Дата бронирования:</span>
                <span className="detail-value">{formatDate(reservation.reservationDate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Статус:</span>
                <span className="detail-value status">
                  {reservation.status === "CONFIRMED" ? "Подтверждено" : "В процессе"}
                </span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h2 className="section-title">Информация о туре</h2>
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Название тура:</span>
                <span className="detail-value">{reservation.tour?.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Направление:</span>
                <span className="detail-value">{reservation.tour?.direction}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Даты тура:</span>
                <span className="detail-value">
                  {formatDate(reservation.tour?.dateFrom)} - {formatDate(reservation.tour?.dateTo)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Длительность:</span>
                <span className="detail-value">{reservation.tour?.duration} дней</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Цена тура:</span>
                <span className="detail-value price">{formatPrice(reservation.tour?.price)}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h2 className="section-title">Информация о перелетах</h2>
            
            <div className="flight-details">
              <p className="flight-direction-title">Ульяновск → {reservation.tour?.direction}</p>
              {reservation.flightTo ? (
                <div className="flight-info">
                  <div className="flight-info-row">
                    <span className="flight-label">Авиакомпания:</span>
                    <span className="flight-value">{reservation.flightTo.airlineName}</span>
                  </div>
                  <div className="flight-info-row">
                    <span className="flight-label">Дата и время:</span>
                    <span className="flight-value">
                      {flightToData.date} {flightToData.time}
                    </span>
                  </div>
                  <div className="flight-info-row">
                    <span className="flight-label">Цена:</span>
                    <span className="flight-value price">{formatPrice(reservation.flightTo.price)}</span>
                  </div>
                </div>
              ) : (
                <div className="no-data-message">Перелет не выбран</div>
              )}
            </div>

            <div className="flight-details">
              <p className="flight-direction-title">{reservation.tour?.direction} → Ульяновск</p>
              {reservation.flightFrom ? (
                <div className="flight-info">
                  <div className="flight-info-row">
                    <span className="flight-label">Авиакомпания:</span>
                    <span className="flight-value">{reservation.flightFrom.airlineName}</span>
                  </div>
                  <div className="flight-info-row">
                    <span className="flight-label">Дата и время:</span>
                    <span className="flight-value">
                      {flightFromData.date} {flightFromData.time}
                    </span>
                  </div>
                  <div className="flight-info-row">
                    <span className="flight-label">Цена:</span>
                    <span className="flight-value price">{formatPrice(reservation.flightFrom.price)}</span>
                  </div>
                </div>
              ) : (
                <div className="no-data-message">Перелет не выбран</div>
              )}
            </div>
          </div>

          <div className="details-section">
            <h2 className="section-title">Информация об отеле</h2>
            {reservation.hotel ? (
              <div className="hotel-info">
                <div className="detail-row">
                  <span className="detail-label">Название отеля:</span>
                  <span className="detail-value">{reservation.hotel.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Расположение:</span>
                  <span className="detail-value">{reservation.hotel.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Тип питания:</span>
                  <span className="detail-value">{reservation.hotel.foodType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Длительность проживания:</span>
                  <span className="detail-value">{reservation.hotel.durationOfStay} дней</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Цена отеля:</span>
                  <span className="detail-value price">{formatPrice(reservation.hotel.price)}</span>
                </div>
              </div>
            ) : (
              <div className="no-data-message">Отель не выбран</div>
            )}
          </div>

          <div className="details-section">
            <h2 className="section-title">Дополнительные услуги</h2>
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Трансфер:</span>
                <span className="detail-value">
                  {reservation.indicateTransfer ? "Включен" : "Не включен"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Страховка:</span>
                <span className="detail-value">
                  {getInsuranceText(reservation.insuranceType)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Способ оплаты:</span>
                <span className="detail-value">
                  {reservation.paymentType === "CASH" ? "Наличные" : "СБП"}
                </span>
              </div>
            </div>
          </div>

          <div className="summary-total">
            <span className="total-label">Общая стоимость:</span>
            <span className="total-price">{formatPrice(reservation.price)}</span>
          </div>
        </div>

        <div className="details-actions">
          <button
            type="button"
            onClick={handleBack}
            className="button-back"
          >
            Назад
          </button>
          
          {isReservationComplete() ? (
            <div className = "d-flex gap-3">
              <button
                type="button"
                onClick={handleCancelReservation}
                className="button-cancel-res"
              >
                Отменить бронирование
              </button>
              <button
                type="button"
                onClick={handleViewVoucher}
                className="button-back"
              >
                Посмотреть ваучер
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleContinueReservation}
              className="button-back"
            >
              Продолжить бронирование
            </button>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Уведомление</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-message">{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={() => setShowModal(false)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}