import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequestLogin } from "../../client/requests";
import "./LoginPage.css";

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const userDt = await postRequestLogin(`http://localhost:8080/login`, {
        login: login,
        password: password,
      });

      localStorage.setItem('userId', userDt.id);
      localStorage.setItem('token', userDt.jwt);

      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      if (error.response?.status === 401 || error.message?.includes("401")) {
        setError("Неверный логин или пароль");
      } else if (error.response?.status === 400) {
        setError("Пожалуйста, заполните все поля");
      } else if (error.response?.status === 500) {
        setError("Ошибка сервера. Попробуйте позже");
      } else {
        setError("Ошибка соединения. Проверьте подключение к серверу");
      }
    } finally {
      setIsLoading(false);
    }
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
                className={`login-input ${error ? "login-input-error" : ""}`}
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
                className={`login-input login-input-password ${error ? "login-input-error" : ""}`}
              />
            </div>

            {error && (
              <div className="login-error-message">
                <svg 
                  className="login-error-icon" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="login-submit-wrapper">
              <button
                type="submit"
                disabled={isLoading}
                className={`login-submit-button ${isLoading ? "login-submit-disabled" : ""}`}
              >
                {isLoading ? "Вход..." : "Войти"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}