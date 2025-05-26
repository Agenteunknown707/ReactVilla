function Sidebar({ activeItem, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'incidencias', icon: '⚠️', label: 'Incidencias' },
    { id: 'mapa', icon: '🗺️', label: 'Mapa' },
    { id: 'reportes', icon: '📊', label: 'Reportes' },
    { id: 'dependencias', icon: '🏢', label: 'Dependencias' },
    { id: 'configuracion', icon: '⚙️', label: 'Configuración' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-items">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar
