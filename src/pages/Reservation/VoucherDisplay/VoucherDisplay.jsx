import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./VoucherDisplay.css";
import Reservation from "../../../client/ReservationRq";

export default function VoucherDisplay() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservationApi = useMemo(() => new Reservation(), []);
  
  const reservation = location.state?.reservation;
  const client = location.state?.client;
  const tour = location.state?.tour;

  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  
  
  const [showTransfer, setShowTransfer] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [voucherGenerated, setVoucherGenerated] = useState(false);

  const handleGenerateVoucher = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const blob = await reservationApi.getVoucher({
        reservationId: reservation.id,
        indicateTransfer: showTransfer,
        indicateInsurance: showInsurance
      });
        
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setVoucherGenerated(true);
    } catch (error) {
      console.error("Ошибка генерации ваучера:", error);
      setError("Не удалось сгенерировать ваучер. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleSendToEmail = async () => {
    if (!reservation?.id) return;
    
    setSendingEmail(true);
    setError(null);
    
    try {
      const response = await reservationApi.sendToEmail(reservation.id);
    
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error("Ошибка отправки:", error);
      setError("Не удалось отправить ваучер на почту");
    } finally {
      setSendingEmail(false);
    }
  };

  
  const handleCompleteReservation = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    navigate("/", { state: { reservationCompleted: true } });
  };

  return (
    <div className="voucher-booking">
      <main className="voucher-main">
        {/* Информация о клиенте */}
        <p className="client-info">
          Генерация ваучера для клиента {client?.lastName} {client?.firstName} {client?.surName}
        </p>

        <div className="voucher-card">
          <h2 className="voucher-title">Ваучер на бронирование</h2>
          
          {/* Информация о бронировании */}
          <div className="voucher-info">
            <div className="info-row">
              <span className="info-label">Номер бронирования:</span>
              <span className="info-value">#{reservation?.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Тур:</span>
              <span className="info-value">{tour?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Клиент:</span>
              <span className="info-value">
                {client?.lastName} {client?.firstName} {client?.surName}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Дата бронирования:</span>
              <span className="info-value">
                {reservation?.reservationDate 
                  ? new Date(reservation.reservationDate).toLocaleString('ru-RU')
                  : 'Не указана'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Способ оплаты:</span>
              <span className="info-value">
                {reservation?.paymentType === "CASH" ? "Наличные" : "СБП"}
              </span>
            </div>
          </div>

          {/* Блок выбора отображаемой информации */}
          <div className="options-container">
            <h3 className="options-title">Выберите информацию для отображения в ваучере</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showTransfer}
                  onChange={(e) => setShowTransfer(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">
                  Отобразить информацию о трансфере
                  {reservation?.indicateTransfer && (
                    <span className="badge-available">(доступен)</span>
                  )}
                </span>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showInsurance}
                  onChange={(e) => setShowInsurance(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">
                  Отобразить информацию о страховке
                  {reservation?.insuranceType && reservation.insuranceType !== "NO" && (
                    <span className="badge-available">(доступна)</span>
                  )}
                </span>
              </label>
            </div>

            {/* Кнопка генерации ваучера */}
            <button
              type="button"
              onClick={handleGenerateVoucher}
              disabled={loading}
              className="button button-generate"
            >
              {loading ? "Генерация..." : "Сгенерировать ваучер"}
            </button>
          </div>

          {/* Отображение ошибки */}
          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* PDF просмотрщик (показывается только после генерации) */}
          {voucherGenerated && pdfUrl && !loading && (
            <div className="pdf-container">
              <h3 className="pdf-title">Ваш ваучер</h3>
              <iframe
                src={pdfUrl}
                className="pdf-viewer"
                title="Ваучер"
                width="100%"
                height="500px"
              >
                Ваш браузер не поддерживает просмотр PDF
              </iframe>
            </div>
          )}

          {/* Кнопки действий (показываются только после генерации ваучера) */}
          {voucherGenerated && pdfUrl && (
            <div className="actions">
              <button
                type="button"
                onClick={handleSendToEmail}
                disabled={sendingEmail}
                className={`button button-email ${sendingEmail ? "button-disabled" : ""}`}
              >
                {sendingEmail ? "Отправка..." : "Отправить ваучер на почту"}
              </button>
              <button
                type="button"
                onClick={handleCompleteReservation}
                className="button button-complete"
              >
                Завершить бронирование
              </button>
            </div>
          )}
        </div>

        {/* Уведомление об успешной отправке */}
        {emailSent && (
          <div className="email-sent-notification">
            Ваучер успешно отправлен на почту клиента!
          </div>
        )}
      </main>
    </div>
  );
}