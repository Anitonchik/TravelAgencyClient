import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ManagerProfilePage.css";
import Manager from "../../client/ManagerRq";

export default function ManagerProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const managerApi = useMemo(() => new Manager(), []);
  
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const managerId = 1;

  useEffect(() => {
    if (managerId) {
      loadManagerData();
    } else if (location.state?.manager) {
      setManager(location.state.manager);
      setLoading(false);
    } else {
      setModalMessage("Информация о менеджере не найдена");
      setShowModal(true);
    }
  }, [managerId]);

  const loadManagerData = async () => {
    setLoading(true);
    try {
      const data = await managerApi.getById(managerId);
      console.log("Данные менеджера:", data);
      setManager(data);
    } catch (error) {
      console.error("Ошибка загрузки данных менеджера:", error);
      setModalMessage("Не удалось загрузить информацию о менеджере");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/manager/edit`, { state: { manager } });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Неверная дата";
      return date.toLocaleDateString("ru-RU", {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "Ошибка даты";
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return "Не указан";
    return phone;
  };

  if (loading) {
    return (
      <div className="manager-profile-page">
        <main className="manager-profile-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка информации о менеджере...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="manager-profile-page">
        <main className="manager-profile-main">
          <div className="error-container">
            <p>Менеджер не найден</p>
            <button onClick={() => navigate(-1)} className="button-back">
              Вернуться назад
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="manager-profile-page">
      <main className="manager-profile-main">
        <h1 className="manager-profile-title">Профиль менеджера</h1>

        <div className="manager-profile-card">
          <div className="profile-section">
            <div className="profile-grid">
              <div className="profile-row">
                <span className="profile-label">Фамилия:</span>
                <span className="profile-value">{manager.lastName || "Не указана"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Имя:</span>
                <span className="profile-value">{manager.firstName || "Не указано"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Отчество:</span>
                <span className="profile-value">{manager.surName || "Не указано"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Дата рождения:</span>
                <span className="profile-value">{formatDate(manager.birthDate)}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email:</span>
                <span className="profile-value">{manager.email || "Не указан"}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Login:</span>
                <span className="profile-value">{manager.login || "Не указан"}</span>
              </div>
            </div>
          </div>
          
        </div>

        <div className="profile-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="button-back"
          >
            Назад
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="button-back"
          >
            Редактировать
          </button>
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