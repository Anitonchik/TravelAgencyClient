import "./Reservation.css";

const STATUS_CONFIG = {
  CONFIRMED: {
    label: "Подтверждено",
    bgClass: "status-bg-confirmed",
    textClass: "status-text-confirmed",
  },
  EXPECTATION: {
    label: "Ожидает",
    bgClass: "status-bg-pending",
    textClass: "status-text-pending",
  },
  CANCELLED: {
    label: "Отменено",
    bgClass: "status-bg-cancelled",
    textClass: "status-text-cancelled",
  },
};

export default function ReservationCard({ dto }) {
  const { label, bgClass, textClass } = STATUS_CONFIG[dto.status];

  let dateFrom = new Date(dto.tour.dateFrom).toISOString().split("T")[0];
  let dateTo = new Date(dto.tour.dateTo).toISOString().split("T")[0];

  return (
    <div className="booking-card">
      {/* Информация о бронировании */}
      <div className="booking-card-info">
        <p className="booking-card-text">
          <span className="booking-card-label">Тур: </span>
          {dto.tour.name}
        </p>
        <p className="booking-card-text">
          <span className="booking-card-label">Клиент: </span>
          {dto.client.lastName} {dto.client.firstName} {dto.client.surName}
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