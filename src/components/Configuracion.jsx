"use client"

import { useState, useEffect } from 'react';
import { FaSave, FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Header from './Header';
import Sidebar from './Sidebar';
import '../App.css';

function Configuracion({ onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Form state
  const [formData, setFormData] = useState({
    systemName: 'Sistema de Gestión de Incidencias',
    municipality: 'Villa de Álvarez',
    logo: null,
    description: 'Sistema para la gestión y seguimiento de incidencias reportadas por los ciudadanos.'
  });

  // Load configuration on component mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // TODO: Replace with actual API call to fetch configuration
        // const response = await fetch('/api/configuracion');
        // const data = await response.json();
        // setFormData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading configuration:', error);
        setNotification({
          show: true,
          message: 'Error al cargar la configuración',
          type: 'error'
        });
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setNotification({
          show: true,
          message: 'Por favor, suba un archivo de imagen válido (PNG, JPG, JPEG)',
          type: 'error'
        });
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setNotification({
          show: true,
          message: 'El archivo no debe superar los 2MB',
          type: 'error'
        });
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.systemName.trim() || !formData.municipality.trim()) {
      setNotification({
        show: true,
        message: 'Por favor complete todos los campos obligatorios',
        type: 'error'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('systemName', formData.systemName);
      formDataToSend.append('municipality', formData.municipality);
      formDataToSend.append('description', formData.description);
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      // TODO: Replace with actual API call to save configuration
      // const response = await fetch('/api/configuracion', {
      //   method: 'POST',
      //   body: formDataToSend
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotification({
        show: true,
        message: 'Configuración guardada exitosamente',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      setNotification({
        show: true,
        message: 'Error al guardar la configuración',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (isLoading) {
    return (
      <div className="main-container">
        <Sidebar activeItem="configuracion" onNavigate={onNavigate} />
        <div className="content-container">
          <Header onLogout={onLogout} />
          <div className="loading-message">Cargando configuración...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <Sidebar activeItem="configuracion" onNavigate={onNavigate} />
      <div className="content-container">
        <Header onLogout={onLogout} />
        
        <div className="configuracion-container">
          <h1 className="page-title">Configuración General</h1>
          <p className="page-subtitle">Administre la configuración general del sistema</p>
          
          {/* Tabs */}
          <div className="config-tabs">
            <button 
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button 
              className={`tab-button ${activeTab === 'notificaciones' ? 'active' : ''}`}
              onClick={() => setActiveTab('notificaciones')}
            >
              Notificaciones
            </button>
            <button 
              className={`tab-button ${activeTab === 'sistema' ? 'active' : ''}`}
              onClick={() => setActiveTab('sistema')}
            >
              Sistema
            </button>
          </div>
          
          {/* Notification */}
          {notification.show && (
            <div className={`notification ${notification.type}`}>
              {notification.type === 'success' ? (
                <FaCheckCircle className="notification-icon" />
              ) : (
                <FaExclamationCircle className="notification-icon" />
              )}
              <span>{notification.message}</span>
            </div>
          )}
          
          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'general' && (
              <form onSubmit={handleSubmit} className="config-form">
                <div className="form-group">
                  <label htmlFor="systemName">Nombre del Sistema *</label>
                  <input
                    type="text"
                    id="systemName"
                    name="systemName"
                    value={formData.systemName}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="municipality">Municipio *</label>
                  <input
                    type="text"
                    id="municipality"
                    name="municipality"
                    value={formData.municipality}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Logo del Ayuntamiento</label>
                  <div className="file-upload">
                    <label className="file-upload-label">
                      <FaUpload className="upload-icon" />
                      {formData.logo ? formData.logo.name || 'Archivo seleccionado' : ' Seleccionar archivo'}
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                    </label>
                    {formData.logo && (
                      <button 
                        type="button" 
                        className="remove-file"
                        onClick={() => setFormData(prev => ({ ...prev, logo: null }))}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  <p className="file-hint">Formatos aceptados: PNG, JPG, JPEG (máx. 2MB)</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Descripción del Sistema</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="4"
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            )}
            
            {activeTab === 'notificaciones' && (
              <div className="coming-soon">
                <h3>Configuración de Notificaciones</h3>
                <p>Esta sección estará disponible próximamente.</p>
              </div>
            )}
            
            {activeTab === 'sistema' && (
              <div className="coming-soon">
                <h3>Configuración del Sistema</h3>
                <p>Esta sección estará disponible próximamente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracion;
