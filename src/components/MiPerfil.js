import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaSave, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import Sidebar from './Sidebar';
import '../App.css';

function MiPerfil({ onNavigate, onLogout }) {
  // State for user profile data
  const [userData, setUserData] = useState({
    nombre: '',
    correo: '',
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: ''
  });

  // State for form validation and UI
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('perfil');

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setUserData(prev => ({
        ...prev,
        nombre: user.nombre || user.responsable || 'Administrador',
        correo: user.email || 'admin@municipalidad.gob'
      }));
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {};

    if (!userData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!userData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.correo)) {
      newErrors.correo = 'Ingrese un correo válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!userData.contrasenaActual) {
      newErrors.contrasenaActual = 'La contraseña actual es requerida';
    }

    if (!userData.contrasenaNueva) {
      newErrors.contrasenaNueva = 'La nueva contraseña es requerida';
    } else if (userData.contrasenaNueva.length < 6) {
      newErrors.contrasenaNueva = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!userData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Confirme la nueva contraseña';
    } else if (userData.contrasenaNueva !== userData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update localStorage
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const updatedUser = {
          ...user,
          nombre: userData.nombre,
          email: userData.correo
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      setSuccessMessage('Perfil actualizado exitosamente');
    } catch (error) {
      setErrors({ general: 'Error al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update localStorage (in real app, this would be server-side)
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const updatedUser = {
          ...user,
          contraseña: userData.contrasenaNueva
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      // Clear password fields
      setUserData(prev => ({
        ...prev,
        contrasenaActual: '',
        contrasenaNueva: '',
        confirmarContrasena: ''
      }));

      setSuccessMessage('Contraseña actualizada exitosamente');
    } catch (error) {
      setErrors({ general: 'Error al actualizar la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="main-container">
      <Sidebar activeItem="perfil" onNavigate={onNavigate} />
      <div className="content-container">
        <main className="main-content">
          <div className="perfil-header">
            <h1>Mi Perfil</h1>
            <p>Gestiona tu información personal y credenciales de acceso</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="success-message">
              <span>{successMessage}</span>
              <button 
                className="close-message"
                onClick={() => setSuccessMessage('')}
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="error-message">
              <span>{errors.general}</span>
            </div>
          )}

          {/* Profile Tabs */}
          <div className="perfil-tabs">
            <button 
              className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              <FaUser /> Información Personal
            </button>
            <button 
              className={`tab-btn ${activeTab === 'seguridad' ? 'active' : ''}`}
              onClick={() => setActiveTab('seguridad')}
            >
              <FaLock /> Cambiar Contraseña
            </button>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'perfil' && (
            <div className="perfil-content">
              <form onSubmit={handleProfileUpdate} className="perfil-form">
                <div className="form-group">
                  <label htmlFor="nombre">
                    <FaUser /> Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={userData.nombre}
                    onChange={handleInputChange}
                    className={`form-control ${errors.nombre ? 'error' : ''}`}
                    placeholder="Ingrese su nombre completo"
                  />
                  {errors.nombre && (
                    <span className="error-text">{errors.nombre}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="correo">
                    <FaEnvelope /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={userData.correo}
                    onChange={handleInputChange}
                    className={`form-control ${errors.correo ? 'error' : ''}`}
                    placeholder="Ingrese su correo electrónico"
                  />
                  {errors.correo && (
                    <span className="error-text">{errors.correo}</span>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FaSave /> Actualizar Perfil
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab Content */}
          {activeTab === 'seguridad' && (
            <div className="perfil-content">
              <form onSubmit={handlePasswordUpdate} className="perfil-form">
                <div className="form-group">
                  <label htmlFor="contrasenaActual">
                    <FaLock /> Contraseña Actual
                  </label>
                  <div className="password-input-group">
                    <input
                      type={showPasswords.actual ? 'text' : 'password'}
                      id="contrasenaActual"
                      name="contrasenaActual"
                      value={userData.contrasenaActual}
                      onChange={handleInputChange}
                      className={`form-control ${errors.contrasenaActual ? 'error' : ''}`}
                      placeholder="Ingrese su contraseña actual"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('actual')}
                    >
                      {showPasswords.actual ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.contrasenaActual && (
                    <span className="error-text">{errors.contrasenaActual}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="contrasenaNueva">
                    <FaLock /> Nueva Contraseña
                  </label>
                  <div className="password-input-group">
                    <input
                      type={showPasswords.nueva ? 'text' : 'password'}
                      id="contrasenaNueva"
                      name="contrasenaNueva"
                      value={userData.contrasenaNueva}
                      onChange={handleInputChange}
                      className={`form-control ${errors.contrasenaNueva ? 'error' : ''}`}
                      placeholder="Ingrese su nueva contraseña (mínimo 6 caracteres)"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('nueva')}
                    >
                      {showPasswords.nueva ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.contrasenaNueva && (
                    <span className="error-text">{errors.contrasenaNueva}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmarContrasena">
                    <FaLock /> Confirmar Nueva Contraseña
                  </label>
                  <div className="password-input-group">
                    <input
                      type={showPasswords.confirmar ? 'text' : 'password'}
                      id="confirmarContrasena"
                      name="confirmarContrasena"
                      value={userData.confirmarContrasena}
                      onChange={handleInputChange}
                      className={`form-control ${errors.confirmarContrasena ? 'error' : ''}`}
                      placeholder="Confirme su nueva contraseña"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => togglePasswordVisibility('confirmar')}
                    >
                      {showPasswords.confirmar ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmarContrasena && (
                    <span className="error-text">{errors.confirmarContrasena}</span>
                  )}
                </div>

                <div className="password-requirements">
                  <h4>Requisitos de contraseña:</h4>
                  <ul>
                    <li className={userData.contrasenaNueva.length >= 6 ? 'valid' : ''}>
                      Mínimo 6 caracteres
                    </li>
                    <li className={userData.contrasenaNueva === userData.confirmarContrasena && userData.contrasenaNueva ? 'valid' : ''}>
                      Las contraseñas coinciden
                    </li>
                  </ul>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <FaSave /> Actualizar Contraseña
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default MiPerfil;
