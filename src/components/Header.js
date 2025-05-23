import logo from "../assets/logo.png"

function Header() {
  return (
    <header className="main-header">
      <div className="header-logo-container">
        <img src={logo || "/placeholder.svg"} alt="Logo" className="header-logo" />
        <div className="header-title-container">
          <h1 className="header-title">Sistema de Gestión de Incidencias</h1>
          <h2 className="header-subtitle">H. AYUNTAMIENTO DE VILLA DE ÁLVAREZ</h2>
        </div>
      </div>

      <div className="header-actions">
        <div className="admin-badge">
          <span className="admin-icon">👤</span>
          <span className="admin-text">Administrador:Sistema</span>
        </div>

        <button className="notification-button">
          <span className="notification-icon">🔔</span>
          <span className="notification-badge">2</span>
        </button>

        <button className="profile-button">
          <span className="profile-icon">👤</span>
        </button>
      </div>
    </header>
  )
}

export default Header
