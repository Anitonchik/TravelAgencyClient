import "./Reservation.css";

const STATUS_CONFIG = {
  confirmed: {
    label: "Подтверждено",
    bgClass: "status-bg-confirmed",
    textClass: "status-text-confirmed",
  },
  pending: {
    label: "Ожидает",
    bgClass: "status-bg-pending",
    textClass: "status-text-pending",
  },
  cancelled: {
    label: "Отменено",
    bgClass: "status-bg-cancelled",
    textClass: "status-text-cancelled",
  },
};

export default function ReservationCard({
  tourName,
  clientName,
  dateFrom,
  dateTo,
  status,
}) {
  const { label, bgClass, textClass } = STATUS_CONFIG[status];

  return (
    <div className="booking-card">
      {/* Информация о бронировании */}
      <div className="booking-card-info">
        <p className="booking-card-text">
          <span className="booking-card-label">Тур: </span>
          {tourName}
        </p>
        <p className="booking-card-text">
          <span className="booking-card-label">Клиент: </span>
          {clientName}
        </p>
        <p className="booking-card-text">
          <span className="booking-card-label">Даты: </span>
          {dateFrom} — {dateTo}
        </p>
      </div>

      {/* Статус бронирования */}
      <div className="booking-card-status-wrapper">
        <span className={`booking-card-status ${bgClass} ${textClass}`}>
          {label}
        </span>
      </div>
    </div>
  );
}