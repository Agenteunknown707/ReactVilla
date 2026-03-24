import React, { useState, useRef, useEffect } from 'react'
import { useDynamicConfig } from '../contexts/DynamicConfigContext'
import '../styles/ConfiguracionDinamica.css'

function ConfiguracionDinamica({ onLogout, onNavigate }) {
  const {
    config,
    updatePrimaryColor,
    updateSystemName,
    updateSystemSlogan,
    updateMunicipality,
    updateLogo,
    updateLoginBackground,
    municipalities,
    getCurrentMunicipality
  } = useDynamicConfig()

  // Estados locales para los formularios
  const [tempConfig, setTempConfig] = useState({
    primaryColor: config.primaryColor,
    systemName: config.systemName,
    systemSlogan: config.systemSlogan,
    municipality: config.municipality,
    logo: config.logo,
    loginBackground: config.loginBackground
  })

  const [activeTab, setActiveTab] = useState('general')
  const [previewLogo, setPreviewLogo] = useState(config.logo)
  const [previewBackground, setPreviewBackground] = useState(config.loginBackground)
  const [hasChanges, setHasChanges] = useState(false)

  // Refs para inputs de archivo
  const logoInputRef = useRef(null)
  const backgroundInputRef = useRef(null)

  // Sincronizar con el contexto global
  useEffect(() => {
    setTempConfig({
      primaryColor: config.primaryColor,
      systemName: config.systemName,
      systemSlogan: config.systemSlogan,
      municipality: config.municipality,
      logo: config.logo,
      loginBackground: config.loginBackground
    })
    setPreviewLogo(config.logo)
    setPreviewBackground(config.loginBackground)
  }, [config])

  // Detectar cambios
  useEffect(() => {
    const hasLocalChanges = 
      tempConfig.primaryColor !== config.primaryColor ||
      tempConfig.systemName !== config.systemName ||
      tempConfig.systemSlogan !== config.systemSlogan ||
      tempConfig.municipality !== config.municipality ||
      tempConfig.logo !== config.logo ||
      tempConfig.loginBackground !== config.loginBackground
    
    setHasChanges(hasLocalChanges)
  }, [tempConfig, config])

  // Manejadores de cambios
  const handleColorChange = (color) => {
    setTempConfig(prev => ({ ...prev, primaryColor: color }))
    updatePrimaryColor(color) // Aplicar en tiempo real
  }

  const handleSystemNameChange = (name) => {
    setTempConfig(prev => ({ ...prev, systemName: name }))
    updateSystemName(name) // Aplicar en tiempo real
  }

  const handleSloganChange = (slogan) => {
    setTempConfig(prev => ({ ...prev, systemSlogan: slogan }))
    updateSystemSlogan(slogan) // Aplicar en tiempo real
  }

  const handleMunicipalityChange = (municipality) => {
    setTempConfig(prev => ({ ...prev, municipality }))
    updateMunicipality(municipality) // Aplicar en tiempo real
  }

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const logoUrl = reader.result
        setTempConfig(prev => ({ ...prev, logo: logoUrl }))
        setPreviewLogo(logoUrl)
        updateLogo(logoUrl) // Aplicar en tiempo real
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const backgroundUrl = reader.result
        setTempConfig(prev => ({ ...prev, loginBackground: backgroundUrl }))
        setPreviewBackground(backgroundUrl)
        updateLoginBackground(backgroundUrl) // Aplicar en tiempo real
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setTempConfig(prev => ({ ...prev, logo: null }))
    setPreviewLogo(null)
    updateLogo(null)
  }

  const removeBackground = () => {
    setTempConfig(prev => ({ ...prev, loginBackground: '' }))
    setPreviewBackground('')
    updateLoginBackground('')
  }

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'appearance', label: 'Apariencia', icon: '🎨' },
    { id: 'preview', label: 'Vista Previa', icon: '👁️' }
  ]

  return (
    <div className="main-content">
      <div className="configuracion-header">
        <h1>Configuración Dinámica</h1>
        <p>Personaliza completamente el sistema en tiempo real</p>
      </div>

      {/* Indicador de cambios */}
      {hasChanges && (
        <div className="changes-indicator">
          <span className="changes-badge">Tienes cambios sin guardar</span>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Configuración del Sistema</h3>
        </div>

        {/* Tabs de navegación */}
        <div className="tabs-container">
          <div className="tabs-list">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de los tabs */}
        <div className="tabs-content">
          {activeTab === 'general' && (
            <div className="tab-panel">
              <div className="config-section">
                <h4>Información del Sistema</h4>
                
                {/* Nombre del Sistema */}
                <div className="form-group">
                  <label className="form-label">Nombre del Sistema</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tempConfig.systemName}
                    onChange={(e) => handleSystemNameChange(e.target.value)}
                    placeholder="Ej: Sistema Municipal"
                  />
                </div>

                {/* Lema */}
                <div className="form-group">
                  <label className="form-label">Lema</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tempConfig.systemSlogan}
                    onChange={(e) => handleSloganChange(e.target.value)}
                    placeholder="Ej: Gestión Inteligente"
                  />
                </div>

                {/* Municipio */}
                <div className="form-group">
                  <label className="form-label">Municipio</label>
                  <select
                    className="form-control"
                    value={tempConfig.municipality}
                    onChange={(e) => handleMunicipalityChange(e.target.value)}
                  >
                    {municipalities.map(municipality => (
                      <option key={municipality.value} value={municipality.value}>
                        {municipality.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="tab-panel">
              <div className="config-section">
                <h4>Personalización Visual</h4>
                
                {/* Color del Sistema */}
                <div className="form-group">
                  <label className="form-label">Color Principal del Sistema</label>
                  <div className="color-picker-container">
                    <input
                      type="color"
                      className="color-picker"
                      value={tempConfig.primaryColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                    />
                    <input
                      type="text"
                      className="color-input"
                      value={tempConfig.primaryColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      placeholder="#002D72"
                    />
                    <div 
                      className="color-preview"
                      style={{ backgroundColor: tempConfig.primaryColor }}
                    ></div>
                  </div>
                </div>

                {/* Logo */}
                <div className="form-group">
                  <label className="form-label">Logo del Sistema</label>
                  <div className="file-upload-container">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      className="btn btn-secondary"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      📁 Subir Logo
                    </button>
                    {previewLogo && (
                      <button
                        className="btn btn-danger"
                        onClick={removeLogo}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                  {previewLogo && (
                    <div className="preview-container">
                      <img 
                        src={previewLogo} 
                        alt="Logo preview" 
                        className="logo-preview"
                      />
                    </div>
                  )}
                </div>

                {/* Fondo de Login */}
                <div className="form-group">
                  <label className="form-label">Fondo de Pantalla de Login</label>
                  <div className="file-upload-container">
                    <input
                      ref={backgroundInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      className="btn btn-secondary"
                      onClick={() => backgroundInputRef.current?.click()}
                    >
                      📁 Subir Fondo
                    </button>
                    {previewBackground && (
                      <button
                        className="btn btn-danger"
                        onClick={removeBackground}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                  {previewBackground && (
                    <div className="preview-container">
                      <img 
                        src={previewBackground} 
                        alt="Background preview" 
                        className="background-preview"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="tab-panel">
              <div className="config-section">
                <h4>Vista Previa en Tiempo Real</h4>
                <div className="preview-section">
                  <div className="preview-card">
                    <div 
                      className="preview-header"
                      style={{ backgroundColor: tempConfig.primaryColor }}
                    >
                      <div className="preview-logo-container">
                        {previewLogo ? (
                          <img src={previewLogo} alt="Logo" className="preview-logo" />
                        ) : (
                          <div className="preview-logo-placeholder">LOGO</div>
                        )}
                        <div className="preview-title-container">
                          <div className="preview-title">{tempConfig.systemName}</div>
                          <div className="preview-subtitle">{tempConfig.systemSlogan}</div>
                        </div>
                      </div>
                    </div>
                    <div className="preview-content">
                      <div className="preview-sidebar" style={{ backgroundColor: tempConfig.primaryColor }}>
                        <div className="preview-sidebar-item">🏠 Dashboard</div>
                        <div className="preview-sidebar-item active">📋 Incidencias</div>
                        <div className="preview-sidebar-item">👥 Usuarios</div>
                      </div>
                      <div className="preview-main">
                        <div className="preview-card-content">
                          <h5>Ejemplo de Tarjeta</h5>
                          <p>Esta es una vista previa de cómo se verán los cambios en la aplicación.</p>
                          <button 
                            className="btn btn-primary"
                            style={{ 
                              backgroundColor: tempConfig.primaryColor,
                              borderColor: tempConfig.primaryColor
                            }}
                          >
                            Botón Principal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel de información */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Información de Configuración</h3>
        </div>
        <div className="config-info">
          <div className="info-item">
            <span className="info-label">Municipio Actual:</span>
            <span className="info-value">{getCurrentMunicipality().label}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Color Principal:</span>
            <span className="info-value">{tempConfig.primaryColor}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Logo:</span>
            <span className="info-value">{previewLogo ? 'Configurado' : 'No configurado'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fondo de Login:</span>
            <span className="info-value">{previewBackground ? 'Configurado' : 'Por defecto'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracionDinamica
