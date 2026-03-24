import { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaCog, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { useDynamicConfig } from '../contexts/DynamicConfigContext';

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
  const { config } = useDynamicConfig();
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const notificationRef = useRef(null);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    if (savedMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close notifications dropdown
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
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
        {config.logo ? (
          <img src={config.logo} alt="Logo" className="header-logo" />
        ) : (
          <div className="header-logo-placeholder">
            {config.systemName.charAt(0)}
          </div>
        )}
        <div className="header-title-container">
          <h1 className="header-title">{config.systemName}</h1>
          <h2 className="header-subtitle">{config.systemSlogan}</h2>
        </div>
      </div>

      <div className="header-actions">
        {/* Dark Mode Toggle */}
        <button 
          className="dark-mode-toggle"
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Notifications */}
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
      </div>
    </header>
  );
};

export default Header;
