function Sidebar({ activeItem }) {
  return (
    <div className="sidebar">
      <div className="sidebar-items">
        <div className="sidebar-item">
          <span className="sidebar-icon">⚙️</span>
          <span className="sidebar-text">Dashboard</span>
        </div>

        <div className={`sidebar-item ${activeItem === "incidencias" ? "active" : ""}`}>
          <span className="sidebar-icon">⚠️</span>
          <span className="sidebar-text">Incidencias</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">🗺️</span>
          <span className="sidebar-text">Mapa</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">📊</span>
          <span className="sidebar-text">Reportes</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">🏢</span>
          <span className="sidebar-text">Dependencias</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">⚙️</span>
          <span className="sidebar-text">Configuración</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
