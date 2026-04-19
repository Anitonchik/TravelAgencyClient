import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/header";
import "./ReservationsMain.css";
import ReservationCard from "../../components/Reservation/Reservation";
import SearchSection from "../../components/Search/Search";

const STATUS_FILTERS = [
  { label: "Все", value: "all" },
  { label: "Подтверждено", value: "confirmed" },
  { label: "Ожидает", value: "pending" },
  { label: "Отменено", value: "cancelled" },
];

const BOOKINGS = [
  {
    id: 1,
    clientName: "Гальцова Елизавета Игоревна",
    managerName: "Анна Смирнова",
    tourName: "ДАГЕСТАН-ВСЕ ВКЛЮЧЕНО 3 дня",
    status: "confirmed",
    dateFrom: "2024-06-10",
    dateTo: "2024-06-13",
    price: "60,700 RUB"
  },
  {
    id: 2,
    clientName: "Михаил Петров",
    managerName: "Иван Козлов",
    tourName: "ГОРНЫЙ АЛТАЙ 5 дней",
    status: "pending",
    dateFrom: "2024-07-01",
    dateTo: "2024-07-06",
    price: "85,500 RUB"
  },
  {
    id: 3,
    clientName: "Анна Сидорова",
    managerName: "Елена Морозова",
    tourName: "КАВКАЗСКИЕ МИНЕРАЛЬНЫЕ ВОДЫ 4 дня",
    status: "cancelled",
    dateFrom: "2024-05-20",
    dateTo: "2024-05-24",
    price: "45,200 RUB"
  },
  {
    id: 4,
    clientName: "Дмитрий Волков",
    managerName: "Анна Смирнова",
    tourName: "БАЙКАЛ ЛЕТОМ 7 дней",
    status: "confirmed",
    dateFrom: "2024-08-05",
    dateTo: "2024-08-12",
    price: "120,000 RUB"
  },
  {
    id: 5,
    clientName: "Елена Новикова",
    managerName: "Иван Козлов",
    tourName: "ЗОЛОТОЕ КОЛЬЦО 3 дня",
    status: "pending",
    dateFrom: "2024-06-25",
    dateTo: "2024-06-28",
    price: "35,800 RUB"
  }
];

export default function ReservationsMain() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" 
    ? BOOKINGS 
    : BOOKINGS.filter((b) => b.status === filter);

  const counts = {
    all: BOOKINGS.length,
    confirmed: BOOKINGS.filter((b) => b.status === "confirmed").length,
    pending: BOOKINGS.filter((b) => b.status === "pending").length,
    cancelled: BOOKINGS.filter((b) => b.status === "cancelled").length,
  };

  const getStatusPillClass = (status) => {
    const classes = {
      confirmed: "status-pill-confirmed",
      pending: "status-pill-pending",
      cancelled: "status-pill-cancelled"
    };
    return classes[status] || "";
  };

  return (
    <div className="bookings-container">
      <Header />

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

        

        <div className="stats-grid">
          <div className="stat-card stat-card-all">
            <p className="stat-count">{counts.all}</p>
            <p className="stat-label">Всего</p>
          </div>
          <div className="stat-card stat-card-confirmed">
            <p className="stat-count">{counts.confirmed}</p>
            <p className="stat-label">Подтверждено</p>
          </div>
          <div className="stat-card stat-card-pending">
            <p className="stat-count">{counts.pending}</p>
            <p className="stat-label">Ожидает</p>
          </div>
          <div className="stat-card stat-card-cancelled">
            <p className="stat-count">{counts.cancelled}</p>
            <p className="stat-label">Отменено</p>
          </div>
        </div>

        <SearchSection placeholder="Поиск по клиенту, туру или менеджеру..." />

        <div className="filters-container">
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`filter-chip ${filter === value ? "filter-chip-active" : "filter-chip-inactive"}`}
            >
              {label}
              {value !== "all" && (
                <span className={`filter-badge ${filter === value ? "filter-badge-active" : getStatusPillClass(value)}`}>
                  {counts[value]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bookings-list">
          {filtered.length > 0 ? (
            filtered.map((booking) => (
              <ReservationCard
                key={booking.id}
                tourName={booking.tourName}
                clientName={booking.clientName}
                dateFrom={booking.dateFrom}
                dateTo={booking.dateTo}
                status={booking.status}
              />
            ))
          ) : (
            <div className="empty-state">
              Нет бронирований в этой категории.
            </div>
          )}
        </div>
      </main>

      <footer className="bookings-footer">
        <p className="footer-text">
          © 2024 ГорныйОтдых — отдых на Северном Кавказе
        </p>
      </footer>
    </div>
  );
}