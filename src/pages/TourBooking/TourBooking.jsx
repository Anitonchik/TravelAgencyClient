import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import "./TourBooking.css";

const TOUR_PHOTOS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=220&h=240&fit=crop",
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=240&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=220&h=240&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=340&h=240&fit=crop",
];

const CLIENT_NAME = "Гальцова Елизавета Игоревна";

const TOUR = {
  name: '"ДАГЕСТАН-ВСЕ ВКЛЮЧЕНО" 3 дня',
  activityLevel: "интенсивный уровень",
  tourType: "экскурсионный",
  priceLeft: "60,700 RUB / 7 дней",
  priceRight: "60,700 RUB / 7 дней",
  description: [
    "Приглашаем в увлекательное путешествие по одной из самых красивых дорог мира — Чуйскому тракту!",
    "Нам предстоит длинный путь с головокружительными пейзажами: мы проедем практически до Монголии и увидим настоящий Алтай, сделаем яркие снимки на фоне горных перевалов, вершин, озер и рек.",
  ],
};

export default function TourBooking() {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const navigate = useNavigate();

  const prev = () =>
    setCurrentPhoto((p) => (p - 1 + TOUR_PHOTOS.length) % TOUR_PHOTOS.length);
  const next = () =>
    setCurrentPhoto((p) => (p + 1) % TOUR_PHOTOS.length);

  return (
    <div className="tour-booking-container">
      <Header />

      <main className="main-content">
        {/* Client header */}
        <p className="client-header">
          Выбор тура для клиента {CLIENT_NAME}
        </p>

        {/* Tour name pill — green border */}
        <div className="tour-name-pill">
          <span className="tour-name-text">
            {TOUR.name}
          </span>
        </div>

        {/* Photo strip / carousel */}
        <div className="photo-carousel">
          {/* Desktop: all photos in a row */}
          <div className="desktop-photo-strip">
            {TOUR_PHOTOS.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Фото тура ${idx + 1}`}
                className="photo-thumb"
                onClick={() => setCurrentPhoto(idx)}
              />
            ))}
          </div>

          {/* Mobile: single photo with arrows */}
          <div className="mobile-photo-view">
            <img
              src={TOUR_PHOTOS[currentPhoto]}
              alt={`Фото тура ${currentPhoto + 1}`}
              className="mobile-photo"
            />
            <button
              onClick={prev}
              className="nav-button nav-button-left"
              aria-label="Назад"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={next}
              className="nav-button nav-button-right"
              aria-label="Вперёд"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <div className="photo-dots">
              {TOUR_PHOTOS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhoto(idx)}
                  className={`photo-dot ${idx === currentPhoto ? "photo-dot-active" : "photo-dot-inactive"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Activity + Tour type row */}
        <div className="info-row">
          <p className="info-text">
            Активность:{" "}
            <span className="info-value">{TOUR.activityLevel}</span>
          </p>
          <p className="info-text info-text-right">
            Тип тура:{" "}
            <span className="info-value">{TOUR.tourType}</span>
          </p>
        </div>

        {/* Description */}
        <div className="description-container">
          {TOUR.description.map((para, idx) => (
            <p key={idx} className="description-text">
              {para}
            </p>
          ))}
        </div>

        {/* Price pills row */}
        <div className="price-row">
          <div className="price-pill price-pill-left">
            <span className="price-text">
              {TOUR.priceLeft}
            </span>
          </div>
          <div className="price-pill price-pill-right">
            <span className="price-text">
              {TOUR.priceRight}
            </span>
          </div>
        </div>

        {/* CTA Button — green border */}
        <div className="cta-container">
          <button
            onClick={() => navigate("/bookings")}
            className="cta-button"
          >
            Начать бронирование тура
          </button>
        </div>
      </main>

      <footer className="footer">
        <p className="footer-text">
          © 2024 ГорныйОтдых — отдых на Северном Кавказе
        </p>
      </footer>
    </div>
  );
}