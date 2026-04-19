import { Link, useLocation } from "react-router-dom";
import './Header.css';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#FFB411" />
            <path d="M8 26V14l10-6 10 6v12H22v-7h-8v7H8Z" fill="white" />
          </svg>
          <span className="logo-text">ГорныйОтдых</span>
        </Link>

        <nav className="nav">
          <Link to="/login" className="nav-link">Войти</Link>
          <Link to="/register" className="nav-link">Регистрация</Link>
          <Link to="/profile" className="nav-link">Профиль</Link>
          <Link to="/logout" className="nav-link">Выйти</Link>
          
        </nav>

        <button className="menu-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}
