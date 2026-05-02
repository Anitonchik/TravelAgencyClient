import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("Антонова Анита Александровна");
  const [password, setPassword] = useState("123456");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=1200&fit=crop"
          alt="Природа"
          className="login-image"
        />
        <div className="login-overlay" />

        <div className="login-logo">
          <div className="login-logo-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <span className="login-logo-text">Турагентство</span>
        </div>
      </div>

      <div className="login-right-panel">
        <div className="login-form-wrapper">
          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label className="login-label">
                Логин:
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                placeholder="Введите логин"
                className="login-input"
              />
            </div>

            <div>
              <label className="login-label">
                Пароль:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Введите пароль"
                className="login-input login-input-password"
              />
              <div className="login-forgot-wrapper">
                <button
                  type="button"
                  className="login-forgot-button"
                >
                  Забыли пароль?
                </button>
              </div>
            </div>

            <div className="login-submit-wrapper">
              <button
                type="submit"
                className="login-submit-button"
              >
                Войти
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}