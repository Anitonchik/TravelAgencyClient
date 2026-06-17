import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EditManagerPage.css";
import Manager from "../../client/ManagerRq";

export default function EditManagerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const managerApi = useMemo(() => new Manager(), []);
  const manager = location.state?.manager;

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
    lastName: manager?.lastName || "",
    firstName: manager?.firstName || "",
    surName: manager?.surName || "",
    birthDate: formatDateForInput(manager?.birthDate) || "",
    email: manager?.email || "",
    //login: manager?.login || "",
    password: "",
    confirmPassword: "",
  });
  
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
    if (age < 18) return "Менеджер должен быть старше 18 лет";
    if (age > 120) return "Некорректная дата рождения";
    return "";
  };

  const validateEmail = (value) => {
    if (!value || value.trim().length === 0) return "Email обязателен";
    if (value.length < 6) return "Email должен содержать минимум 6 символов";
    if (value.length > 255) return "Email должен быть не более 255 символов";
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) return "Некорректный формат почты";
    return "";
  };

  const validateLogin = (value) => {
    if (!value || value.trim().length === 0) return "Логин обязателен";
    if (value.length < 6) return "Логин должен содержать минимум 6 символов";
    if (value.length > 20) return "Логин должен быть не более 20 символов";
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Логин может содержать только буквы, цифры и знак подчеркивания";
    return "";
  };

  const validatePassword = (value) => {
    if (!manager) {
      if (!value || value.trim().length === 0) return "Пароль обязателен";
    }
    if (value && value.length > 0) {
      if (value.length < 6) return "Пароль должен содержать минимум 6 символов";
      if (value.length > 12) return "Пароль должен быть не более 12 символов";
    }
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (form.password && value !== form.password) {
      return "Пароли не совпадают";
    }
    return "";
  };

  const validateField = (name, value) => {
    switch (name) {
      case "lastName": return validateLastName(value);
      case "firstName": return validateFirstName(value);
      case "surName": return validateSurName(value);
      case "birthDate": return validateBirthDate(value);
      case "email": return validateEmail(value);
      // case "login": return validateLogin(value);
      case "password": return validatePassword(value);
      case "confirmPassword": return validateConfirmPassword(value);
      default: return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    
    if (name === "password" && form.confirmPassword) {
      const confirmError = validateConfirmPassword(form.confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const fieldsToValidate = ["lastName", "firstName", "surName", "birthDate", "email"];
    
    if (!manager || form.password) {
      fieldsToValidate.push("password");
      if (form.password) fieldsToValidate.push("confirmPassword");
    }
    
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
      email: true,
      // login: true,
    };
    
    if (!manager || form.password) {
      allTouched.password = true;
      if (form.password) allTouched.confirmPassword = true;
    }
    
    setTouched(allTouched);
    
    if (!isFormValid()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const managerData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        surName: form.surName.trim(),
        birthDate: new Date(form.birthDate),
        email: form.email.trim().toLowerCase(),
        // login: form.login.trim(),
      };
      
      if (form.password) {
        managerData.password = form.password;
      }
      else {
        managerData.password = manager?.password;  
      }
    
      if (manager) {
        await managerApi.update(managerData, manager.id);

        setModalMessage("Данные менеджера успешно обновлены");
      } else {
        await managerApi.create(managerData);
        setModalMessage("Менеджер успешно создан");
      }
      
      setTimeout(() => {
        navigate("/manager/profile");
      }, 1500);
    } catch (error) {
      console.error("Ошибка при сохранении менеджера:", error);
      
      if (error.message?.includes("повторяющееся значение") || 
          error.message?.includes("duplicate key") ||
          error.message?.includes("unique constraint")) {
        
        let fieldName = "";
        
        if (error.message?.includes("email")) {
          fieldName = "Email";
        } else if (error.message?.includes("login")) {
          fieldName = "Логин";
        } else {
          fieldName = "Данные";
        }
        
        setModalMessage(`Менеджер с таким ${fieldName} уже существует в системе`);
      } else if (error.response?.status === 409) {
        setModalMessage("Менеджер с таким email или логином уже существует");
      } else {
        setModalMessage("Произошла ошибка при сохранении. Попробуйте позже.");
      }
      
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "form-input";
    const isError = touched[fieldName] && errors[fieldName];
    return `${baseClass} ${isError ? "form-input-error" : ""}`;
  };

  return (
    <div className="edit-manager-page">
      <main className="edit-manager-main">
        <h1 className="edit-manager-title">
          {manager ? "Редактирование менеджера" : "Создать учетную запись менеджера"}
        </h1>

        <form onSubmit={handleSubmit} className="edit-manager-form">
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
              <label className="form-label">Email:</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("email")}
                placeholder="manager@example.com"
              />
              {touched.email && errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>
          </div>

          {/*<div className="form-row">
            <div className="form-field">
              <label className="form-label">Логин:</label>
              <input
                name="login"
                type="text"
                value={form.login}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("login")}
                placeholder="ivanov_ivan"
              />
              {touched.login && errors.login && (
                <span className="form-error">{errors.login}</span>
              )}
            </div>
            <div className="form-field">
            </div>
          </div>*/}

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">
                {manager ? "Новый пароль (оставьте пустым, чтобы не менять)" : "Пароль:"}
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("password")}
                placeholder="******"
              />
              {touched.password && errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>
            <div className="form-field">
              <label className="form-label">Подтверждение пароля:</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("confirmPassword")}
                placeholder="******"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

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