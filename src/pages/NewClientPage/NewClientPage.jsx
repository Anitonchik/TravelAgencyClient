import { useState, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NewClientPage.css";
import Client from "../../client/ClientRq";

export default function NewClient() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const passportFileInputRef = useRef(null);
  const policyFileInputRef = useRef(null);
  const clientApi = useMemo(() => new Client(), []);
  const client = location.state?.client;
  console.log("Редактируемый клиент:", client);

  const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Ошибка форматирования даты:", error);
    return "";
  }
};

  const [form, setForm] = useState({
    lastName: client?.lastName || "",
    firstName: client?.firstName || "",
    surName: client?.surName || "",
    phone: client?.phone || "",
    email: client?.email || "",
    passportSeries: client?.passport.series || "",
    passportNumber: client?.passport.numbers || "",
    omsPolicy: client?.policy.CMIPolicy || "",
    snils: client?.snils || "",
    birthDate: formatDateForInput(client?.birthDate) || "",
    preferences: client?.preferenceDescription || "",
  });
  
  const [passportFiles, setPassportFiles] = useState([]);
  const [policyFiles, setPolicyFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateLastName = (value) => {
    if (!value || value.trim().length === 0) return "Фамилия обязательна";
    if (value.length < 2) return "Фамилия должна содержать минимум 2 символа";
    if (value.length > 255) return "Фамилия должна быть не более 255 символов";
    return "";
  };

  const validateFirstName = (value) => {
    if (!value || value.trim().length === 0) return "Имя обязательно";
    if (value.length < 2) return "Имя должно содержать минимум 2 символа";
    if (value.length > 255) return "Имя должно быть не более 255 символов";
    return "";
  };

  const validateSurName = (value) => {
    if (!value || value.trim().length === 0) return "Отчество обязательно";
    if (value.length < 2) return "Отчество должно содержать минимум 2 символа";
    if (value.length > 255) return "Отчество должно быть не более 255 символов";
    return "";
  };

  const validateBirthDate = (value) => {
    if (!value) return "Дата рождения обязательна";
    const birthDate = new Date(value);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return "Неверный формат даты";
    if (birthDate > today) return "Дата рождения не может быть в будущем";
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) return "Клиент должен быть старше 18 лет";
    if (age > 120) return "Некорректная дата рождения";
    return "";
  };

  const validatePhone = (value) => {
    if (!value || value.trim().length === 0) return "Телефон обязателен";
    const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
    if (!phoneRegex.test(value)) return "Некорректный формат номера телефона";
    return "";
  };

  const validateEmail = (value) => {
    if (!value || value.trim().length === 0) return "Email обязателен";
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) return "Некорректный формат почты";
    if (value.length > 255) return "Email должен быть не более 255 символов";
    return "";
  };

  const validatePassportSeries = (value) => {
    if (!value || value.trim().length === 0) return "Серия паспорта обязательна";
    const cleanValue = value.replace(/\s/g, '');
    if (cleanValue.length !== 4) return "Серия паспорта должна содержать 4 цифры";
    if (!/^\d{4}$/.test(cleanValue)) return "Серия паспорта должна содержать только цифры";
    return "";
  };

  const validatePassportNumber = (value) => {
    if (!value || value.trim().length === 0) return "Номер паспорта обязателен";
    const cleanValue = value.replace(/\s/g, '');
    if (cleanValue.length !== 6) return "Номер паспорта должен содержать 6 цифр";
    if (!/^\d{6}$/.test(cleanValue)) return "Номер паспорта должен содержать только цифры";
    return "";
  };

  const validateOmsPolicy = (value) => {
    if (!value || value.trim().length === 0) return "Полис ОМС обязателен";
    const cleanValue = value.replace(/\s/g, '');
    if (cleanValue.length !== 16) return "Полис ОМС должен содержать 16 цифр";
    if (!/^\d{16}$/.test(cleanValue)) return "Полис ОМС должен содержать только цифры";
    return "";
  };

  const validateSnils = (value) => {
    if (!value || value.trim().length === 0) return "СНИЛС обязателен";
    const cleanValue = value.replace(/[\s-]/g, '');
    if (cleanValue.length !== 11) return "СНИЛС должен содержать 11 цифр";
    if (!/^\d{11}$/.test(cleanValue)) return "СНИЛС должен содержать только цифры";
    return "";
  };

  const validateField = (name, value) => {
    switch (name) {
      case "lastName": return validateLastName(value);
      case "firstName": return validateFirstName(value);
      case "surName": return validateSurName(value);
      case "birthDate": return validateBirthDate(value);
      case "phone": return validatePhone(value);
      case "email": return validateEmail(value);
      case "passportSeries": return validatePassportSeries(value);
      case "passportNumber": return validatePassportNumber(value);
      case "omsPolicy": return validateOmsPolicy(value);
      case "snils": return validateSnils(value);
      default: return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePassportFileChange = (e) => {
    if (e.target.files) {
      setPassportFiles(Array.from(e.target.files));
    }
  };

  const handlePolicyFileChange = (e) => {
    if (e.target.files) {
      setPolicyFiles(Array.from(e.target.files));
    }
  };

  const isFormValid = () => {
    const fieldsToValidate = ["lastName", "firstName", "surName", "birthDate", "phone", "email", "passportSeries", "passportNumber", "omsPolicy", "snils"];
    let isValid = true;
    const newErrors = {};
    
    for (const field of fieldsToValidate) {
      const error = validateField(field, form[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = {
      lastName: true,
      firstName: true,
      surName: true,
      birthDate: true,
      phone: true,
      email: true,
      passportSeries: true,
      passportNumber: true,
      omsPolicy: true,
      snils: true,
    };
    setTouched(allTouched);
    
    if (!isFormValid()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const clientData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        surName: form.surName.trim(),
        birthDate: new Date(form.birthDate),
        snils: form.snils.replace(/[\s-]/g, ''),
        email: form.email,
        phone: form.phone,
        preferenceDescription: form.preferences,
        passportSeries: form.passportSeries.replace(/\s/g, ''),
        passportNumbers: form.passportNumber.replace(/\s/g, ''),
        passportImage: passportFiles.length > 0 ? passportFiles[0].name : "",
        policy: form.omsPolicy.replace(/\s/g, ''),
        policyImage: policyFiles.length > 0 ? policyFiles[0].name : "",
      };
    
      if (client) {
        await clientApi.update(clientData, client.id);
      }
      else {
        await clientApi.create(clientData);
      }
      navigate("/");
    } catch (error) {
      console.error("Ошибка при сохранении клиента:", error);
    
      if (error.message?.includes("повторяющееся значение ключа") || 
          error.message?.includes("duplicate key") ||
          error.message?.includes("unique constraint")) {
        
        let fieldName = "";
        let fieldValue = "";
        
        if (error.message?.includes("numbers")) {
          fieldName = "Номер паспорта";
          fieldValue = form.passportNumber;
        } else if (error.message?.includes("series")) {
          fieldName = "Серия паспорта";
          fieldValue = form.passportSeries;
        } else if (error.message?.includes("snils")) {
          fieldName = "СНИЛС";
          fieldValue = form.snils;
        } else if (error.message?.includes("email")) {
          fieldName = "Email";
          fieldValue = form.email;
        } else if (error.message?.includes("phone")) {
          fieldName = "Телефон";
          fieldValue = form.phone;
        } else if (error.message?.includes("policy")) {
          fieldName = "Полис ОМС";
          fieldValue = form.omsPolicy;
        } else {
          fieldName = "Данные";
          fieldValue = "неизвестное значение";
        }
        
        setModalMessage(`Клиент с таким ${fieldName} (${fieldValue}) уже существует в системе`);
      } else if (error.response?.status === 409) {
        setModalMessage("Клиент с такими данными уже существует в системе");
      } else {
        setModalMessage("Произошла ошибка при сохранении клиента. Попробуйте позже.");
      }
      
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handlePassportSeriesInput = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length === 2) {
      value = value + ' ';
    }
    e.target.value = value;
    handleChange(e);
  };

  const handlePassportNumberInput = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 6);
    if (value.length === 3) {
      value = value + ' ';
    }
    e.target.value = value;
    handleChange(e);
  };

  const handleSnilsInput = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (value.length > 3) value = value.slice(0, 3) + '-' + value.slice(3);
    if (value.length > 7) value = value.slice(0, 7) + '-' + value.slice(7);
    e.target.value = value;
    handleChange(e);
  };

  const handleOmsInput = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    if (value.length === 4) value = value + ' ';
    if (value.length === 9) value = value + ' ';
    if (value.length === 14) value = value + ' ';
    e.target.value = value;
    handleChange(e);
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "form-input";
    const isError = touched[fieldName] && errors[fieldName];
    return `${baseClass} ${isError ? "form-input-error" : ""}`;
  };

  const FileUploadSection = ({ title, fileInputRef, files, onFileChange, accept = "image/*,.pdf" }) => (
    <div className="form-field-full">
      <label className="form-label">{title}:</label>
      <div className="file-upload-container">
        <div
          className="file-dropzone"
          onClick={() => fileInputRef.current?.click()}
        >
          {files.length > 0 ? (
            <div className="file-info">
              <p className="file-count">
                {files.length} файл(ов) выбрано
              </p>
              <p className="file-names">
                {files.map((f) => f.name).join(", ")}
              </p>
            </div>
          ) : (
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#282828"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            className="hidden-input"
            onChange={onFileChange}
          />
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="add-files-button"
        >
          Добавить файлы
        </button>
      </div>
    </div>
  );

  return (
    <div className="new-client-page">
      <main className="new-client-main">
        <h1 className="new-client-title">Создать учетную запись клиента</h1>

        <form onSubmit={handleSubmit} className="new-client-form">
          {/* Row 1: Фамилия + Имя + Отчество */}
          <div className="form-row-three">
            <div className="form-field">
              <label className="form-label">Фамилия:</label>
              <input
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("lastName")}
                placeholder="Иванов"
              />
              {touched.lastName && errors.lastName && (
                <span className="form-error">{errors.lastName}</span>
              )}
            </div>
            <div className="form-field">
              <label className="form-label">Имя:</label>
              <input
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("firstName")}
                placeholder="Иван"
              />
              {touched.firstName && errors.firstName && (
                <span className="form-error">{errors.firstName}</span>
              )}
            </div>
            <div className="form-field">
              <label className="form-label">Отчество:</label>
              <input
                name="surName"
                type="text"
                value={form.surName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("surName")}
                placeholder="Иванович"
              />
              {touched.surName && errors.surName && (
                <span className="form-error">{errors.surName}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Дата рождения:</label>
              <input
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("birthDate")}
              />
              {touched.birthDate && errors.birthDate && (
                <span className="form-error">{errors.birthDate}</span>
              )}
            </div>
            <div className="form-field">
              <label className="form-label">Телефон:</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("phone")}
                placeholder="+7 (999) 999-99-99"
              />
              {touched.phone && errors.phone && (
                <span className="form-error">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Почта:</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("email")}
                placeholder="example@mail.com"
              />
              {touched.email && errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>
            <div className="passport-group">
              <div className="form-field">
                <label className="form-label">Серия паспорта:</label>
                <input
                  name="passportSeries"
                  type="text"
                  value={form.passportSeries}
                  onChange={handlePassportSeriesInput}
                  onBlur={handleBlur}
                  className={getInputClassName("passportSeries")}
                  placeholder="00 00"
                  maxLength={5}
                />
                {touched.passportSeries && errors.passportSeries && (
                  <span className="form-error">{errors.passportSeries}</span>
                )}
              </div>
              <div className="form-field">
                <label className="form-label">Номер паспорта:</label>
                <input
                  name="passportNumber"
                  type="text"
                  value={form.passportNumber}
                  onChange={handlePassportNumberInput}
                  onBlur={handleBlur}
                  className={getInputClassName("passportNumber")}
                  placeholder="000 000"
                  maxLength={7}
                />
                {touched.passportNumber && errors.passportNumber && (
                  <span className="form-error">{errors.passportNumber}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Полис ОМС:</label>
              <input
                name="omsPolicy"
                type="text"
                value={form.omsPolicy}
                onChange={handleOmsInput}
                onBlur={handleBlur}
                className={getInputClassName("omsPolicy")}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
              {touched.omsPolicy && errors.omsPolicy && (
                <span className="form-error">{errors.omsPolicy}</span>
              )}
            </div>
            <div className="form-field">
              <label className="form-label">СНИЛС:</label>
              <input
                name="snils"
                type="text"
                value={form.snils}
                onChange={handleSnilsInput}
                onBlur={handleBlur}
                className={getInputClassName("snils")}
                placeholder="000-000-000 00"
                maxLength={14}
              />
              {touched.snils && errors.snils && (
                <span className="form-error">{errors.snils}</span>
              )}
            </div>
          </div>

          <div className="form-field-full">
            <label className="form-label">Предпочтения:</label>
            <textarea
              name="preferences"
              value={form.preferences}
              onChange={handleChange}
              rows={4}
              className="form-textarea"
              placeholder="Дополнительные пожелания..."
            />
          </div>

          <FileUploadSection
            title="Скан паспорта"
            fileInputRef={passportFileInputRef}
            files={passportFiles}
            onFileChange={handlePassportFileChange}
            accept="image/*,.pdf"
          />

          <FileUploadSection
            title="Скан полиса ОМС"
            fileInputRef={policyFileInputRef}
            files={policyFiles}
            onFileChange={handlePolicyFileChange}
            accept="image/*,.pdf"
          />

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="button-cancel"
            >
              Отменить
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`button-submit ${isSubmitting ? "button-disabled" : ""}`}
            >
              {isSubmitting ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Ошибка</h3>
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