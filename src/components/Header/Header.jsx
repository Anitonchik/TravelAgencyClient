import { Link, useLocation, useNavigate  } from "react-router-dom";
import './Header.css';

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');


  const handleLogout = () => {
  if (window.confirm('Вы уверены, что хотите выйти?')) {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  }
};

return (
<>
  <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#FFB411" />
            <path d="M8 26V14l10-6 10 6v12H22v-7h-8v7H8Z" fill="white" />
          </svg>
          <span className="logo-text">РоссияОтдых</span>
        </Link>

      {userId && token ? (
        <nav className="nav">
          <Link to="/" className="nav-link">Бронирования</Link>
          <Link to="/clients" className="nav-link">Клиенты</Link>
          <Link to="/tours" className="nav-link">Туры</Link>
          <Link to="/manager/profile" className="nav-link">Профиль</Link>
          <button onClick={handleLogout} className="nav-link logout-btn">Выйти</button>
        </nav>) : 
        (<></>)}

        <button className="menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  </>
  )
}