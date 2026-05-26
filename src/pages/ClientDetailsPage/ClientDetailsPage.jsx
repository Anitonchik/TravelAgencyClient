import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ClientDetailsPage.css";
import Client from "../../client/ClientRq";

export default function ClientDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const clientApi = useMemo(() => new Client(), []);
  
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState("");


  useEffect(() => {

    if (location.state?.client) {
        console.log("Полученные данные клиента:", location.state.client);
        setClient(location.state.client);
        setLoading(false);
    } else {
        setModalMessage("Информация о клиенте не найдена");
        setShowSuccessModal(true);
    }
  }, [client]);


  const handleEdit = () => {
    navigate(`/clients/create`, { state: { client } });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await clientApi.delete(client.id);
      setShowDeleteModal(false);
      setModalMessage("Клиент успешно удален");
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/clients");
      }, 1500);
    } catch (error) {
      console.error("Ошибка удаления клиента:", error);
      setModalMessage("Не удалось удалить клиента. Попробуйте позже.");
      setShowSuccessModal(true);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewImage = (imagePath) => {
    setCurrentImage(imagePath);
    setShowImageModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Неверная дата";
      return date.toLocaleDateString("ru-RU");
    } catch {
      return "Ошибка даты";
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return "Не указан";
    return phone;
  };

  const formatSnils = (snils) => {
    if (!snils) return "Не указан";
    const clean = snils.replace(/\D/g, '');
    if (clean.length === 11) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 9)} ${clean.slice(9, 11)}`;
    }
    return snils;
  };

  const formatPassport = (series, number) => {
    if (!series && !number) return "Не указаны";
    return `${series || "??"} ${number || "??????"}`;
  };

  const formatPolicy = (policy) => {
    if (!policy) return "Не указан";
    const clean = policy.replace(/\D/g, '');
    if (clean.length === 16) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)} ${clean.slice(12, 16)}`;
    }
    return policy;
  };

  if (loading) {
    return (
      <div className="client-details-page">
        <main className="client-details-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка информации о клиенте...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="client-details-page">
        <main className="client-details-main">
          <div className="error-container">
            <p>Клиент не найден</p>
            <button onClick={() => navigate(-1)} className="button-cancel">
              Вернуться назад
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="client-details-page">
      <main className="client-details-main">
        <h1 className="client-details-title">Информация о клиенте</h1>

        <div className="client-details-card">
          {/* ФИО */}
          <div className="details-section">
            <h2 className="section-title">Основная информация</h2>
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Фамилия:</span>
                <span className="detail-value">{client.lastName || "Не указана"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Имя:</span>
                <span className="detail-value">{client.firstName || "Не указано"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Отчество:</span>
                <span className="detail-value">{client.surName || "Не указано"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Дата рождения:</span>
                <span className="detail-value">{formatDate(client.birthDate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Телефон:</span>
                <span className="detail-value">{formatPhone(client.phone)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{client.email || "Не указан"}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h2 className="section-title">Паспортные данные</h2>
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Серия паспорта:</span>
                <span className="detail-value">{client.passport.series || "Не указана"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Номер паспорта:</span>
                <span className="detail-value">{client.passport.numbers || "Не указан"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Полный номер:</span>
                <span className="detail-value">{formatPassport(client.passport.series, client.passport.numbers)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Скан паспорта:</span>
                <span className="detail-value">
                    {client.passport.image ? (
                      <button 
                        onClick={() => handleViewImage(client.passport.image)} 
                        className="file-link-button"
                      >
                        Смотреть файл
                      </button>
                    ) : (
                      "Не загружен"
                    )}
                  </span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h2 className="section-title">Медицинские документы</h2>
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Полис ОМС:</span>
                <span className="detail-value">{formatPolicy(client.policy.CMIPolicy)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">СНИЛС:</span>
                <span className="detail-value">{formatSnils(client.snils)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Скан полиса:</span>
                  <span className="detail-value">
                    {client.policy.image ? (
                      <button 
                        onClick={() => handleViewImage(client.policy.image)} 
                        className="file-link-button"
                      >
                        Смотреть файл
                      </button>
                    ) : (
                      "Не загружен"
                    )}
                  </span>
              </div>
            </div>
          </div>

          {client.preferenceDescription && (
            <div className="details-section">
              <h2 className="section-title">Предпочтения</h2>
              <div className="preferences-text">
                {client.preferenceDescription}
              </div>
            </div>
          )}
        </div>

        <div className="details-actions">
          <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="button-delete"
            >
              Удалить
            </button>
          <div className="actions-right">
            

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
        </div>
      </main>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Подтверждение удаления</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-message">
                Вы действительно хотите удалить клиента?
              </p>
              <p className="modal-submessage">
                {client.lastName} {client.firstName} {client.surName}
              </p>
              <p className="modal-warning">
                Это действие невозможно отменить.
              </p>
            </div>
            <div className="modal-footer-two">
              <button
                className="modal-button-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Отмена
              </button>
              <button
                className="modal-button-delete"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Уведомление</h3>
              <button className="modal-close" onClick={() => setShowSuccessModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-message">{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={() => setShowSuccessModal(false)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
      <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
        <div className="image-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setShowImageModal(false)}>×</button>
          <img 
            src={`src/resources/${currentImage}`} 
            alt="Документ"
            className="modal-image"
          />
        </div>
      </div>
    )}
    </div>
  );
}