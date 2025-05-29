import { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaCog, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from "../assets/logo.png";

// Mock notifications data
const mockNotifications = {
  all: [
    { id: 1, department: 'Obras Públicas', message: 'Bache pequeño en curva', time: '5 días atrás', read: false, type: 'bache' },
    { id: 2, department: 'Servicios Públicos', message: 'Farola apagada en avenida principal', time: '2 días atrás', read: false, type: 'alumbrado' },
    { id: 3, department: 'Protección Civil', message: 'Árbol caído en parque central', time: '1 día atrás', read: true, type: 'arbol' },
    { id: 4, department: 'Agua Potable', message: 'Fuga de agua en calle secundaria', time: '3 días atrás', read: true, type: 'agua' },
  ],
  following: [
    { id: 1, department: 'Obras Públicas', message: 'Bache pequeño en curva', time: '5 días atrás', read: false, type: 'bache' },
    { id: 4, department: 'Agua Potable', message: 'Fuga de agua en calle secundaria', time: '3 días atrás', read: true, type: 'agua' },
  ],
  archived: [
    { id: 5, department: 'Basura', message: 'Recolección de basura atrasada', time: '1 semana atrás', read: true, type: 'basura' },
  ]
};

function Header({ onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const notificationRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close notifications dropdown
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      // Close profile menu
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleProfileClick = () => {
    // TODO: Implement profile navigation
    console.log('Navigate to profile');
    setShowProfileMenu(false);
  };

  const markAllAsRead = () => {
    const updatedNotifications = { ...notifications };
    updatedNotifications.all = updatedNotifications.all.map(notif => ({
      ...notif,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  const markAsRead = (id) => {
    const updatedNotifications = { ...notifications };
    updatedNotifications.all = updatedNotifications.all.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
  };

  const unreadCount = notifications.all.filter(notif => !notif.read).length;
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
          <span className="admin-text">Administrador: Sistema</span>
        </div>

        <div className="notification-container" ref={notificationRef}>
          <button 
            className={`notification-button ${showNotifications ? 'active' : ''}`} 
            onClick={toggleNotifications}
          >
            <FaBell className="notification-icon" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notificaciones</h3>
                <div className="notification-actions">
                  <button 
                    className="mark-all-read"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                  >
                    <FaCheck /> Marcar todo como leído
                  </button>
                  <button 
                    className="close-notifications"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifications(false);
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              <div className="notification-tabs">
                <button 
                  className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  Todas {unreadCount > 0 && <span className="tab-badge">{unreadCount}</span>}
                </button>
                <button 
                  className={`tab ${activeTab === 'following' ? 'active' : ''}`}
                  onClick={() => setActiveTab('following')}
                >
                  Siguiendo
                </button>
                <button 
                  className={`tab ${activeTab === 'archived' ? 'active' : ''}`}
                  onClick={() => setActiveTab('archived')}
                >
                  Archivo
                </button>
              </div>
              
              <div className="notification-list">
                {notifications[activeTab].length === 0 ? (
                  <div className="empty-notifications">
                    No hay notificaciones
                  </div>
                ) : (
                  notifications[activeTab].map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="notification-content">
                        <div className="notification-type">
                          <span className={`type-badge ${notification.type}`}></span>
                        </div>
                        <div className="notification-details">
                          <div className="notification-department">
                            {notification.department}
                          </div>
                          <div className="notification-message">
                            {notification.message}
                          </div>
                          <div className="notification-time">
                            {notification.time}
                          </div>
                        </div>
                      </div>
                      {!notification.read && (
                        <button 
                          className="mark-as-read"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              <div className="notification-footer">
                <button 
                  className="notification-settings"
                  onClick={() => {
                    // TODO: Implement notification settings navigation
                    console.log('Navigate to notification settings');
                  }}
                >
                  <FaCog /> Configurar notificaciones
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-menu-container" ref={profileMenuRef}>
          <button 
            className={`profile-button ${showProfileMenu ? 'active' : ''}`} 
            onClick={toggleProfileMenu}
            aria-expanded={showProfileMenu}
            aria-label="Menú de perfil"
          >
            <span className="profile-icon">👤</span>
          </button>
          
          {showProfileMenu && (
            <div className="profile-dropdown">
              <button 
                className="dropdown-item"
                onClick={handleProfileClick}
              >
                <FaUser className="dropdown-icon" />
                <span>Mi Perfil</span>
              </button>
              <button 
                className="dropdown-item logout"
                onClick={onLogout}
              >
                <FaSignOutAlt className="dropdown-icon" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
