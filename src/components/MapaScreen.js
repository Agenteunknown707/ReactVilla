import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { FaSyncAlt, FaInfoCircle } from 'react-icons/fa';
import Header from './Header';
import Sidebar from './Sidebar';
import 'leaflet/dist/leaflet.css';
import '../App.css';

// Fix for default marker icons in Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Legend Component
const Legend = () => {
  return (
    <div className="map-legend">
      <h4>Leyenda</h4>
      <div className="legend-item">
        <span className="legend-color" style={{ backgroundColor: '#ffd700' }}></span>
        <span>Pendiente</span>
      </div>
      <div className="legend-item">
        <span className="legend-color" style={{ backgroundColor: '#2e86c1' }}></span>
        <span>En Proceso</span>
      </div>
      <div className="legend-item">
        <span className="legend-color" style={{ backgroundColor: '#27ae60' }}></span>
        <span>Resuelto</span>
      </div>
      <div className="legend-item">
        <span className="legend-color" style={{ backgroundColor: '#c0392b' }}></span>
        <span>Cancelado</span>
      </div>
    </div>
  );
};

// Component to handle map view changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

// Custom marker icon based on status
const getStatusIcon = (status) => {
  const iconUrl = {
    'Pendiente': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    'En Proceso': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    'Resuelto': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    'Cancelado': 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
  }[status] || icon;

  return L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Main Map Component
const MapaScreen = ({ onNavigate, onLogout }) => {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter] = useState([19.2489, -103.7241]); // Villa de Álvarez coordinates
  const [zoom] = useState(14);
  const mapRef = useRef(null);

  // Load incidents data
  useEffect(() => {
    cargarIncidencias();
  }, []);

  // Mock function to load incidents (replace with API call)
  const cargarIncidencias = () => {
    setLoading(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockIncidencias = [
        {
          id: 1,
          titulo: 'Bache en avenida principal',
          descripcion: 'Bache grande en la avenida principal, frente al parque',
          lat: 19.2589,
          lng: -103.7341,
          estado: 'Pendiente',
          fecha: '2023-05-23',
          direccion: 'Av. Morelos #123, Col. Centro',
          categoria: 'Bache'
        },
        {
          id: 2,
          titulo: 'Alumbrado público dañado',
          descripcion: 'Poste de luz sin funcionar',
          lat: 19.2489,
          lng: -103.7141,
          estado: 'En Proceso',
          fecha: '2023-05-22',
          direccion: 'Calle Hidalgo #456, Col. Centro',
          categoria: 'Alumbrado Público'
        },
        {
          id: 3,
          titulo: 'Fuga de agua',
          descripcion: 'Fuga de agua en la esquina',
          lat: 19.2389,
          lng: -103.7241,
          estado: 'Resuelto',
          fecha: '2023-05-20',
          direccion: 'Calle Juárez #789, Col. Centro',
          categoria: 'Agua Potable'
        },
        {
          id: 4,
          titulo: 'Recolección de basura',
          descripcion: 'Basura acumulada en la esquina',
          lat: 19.2489,
          lng: -103.7041,
          estado: 'Cancelado',
          fecha: '2023-05-18',
          direccion: 'Calle Madero #101, Col. Centro',
          categoria: 'Limpieza Pública'
        },
        {
          id: 5,
          titulo: 'Semáforo dañado',
          descripcion: 'Semáforo no funciona en la esquina',
          lat: 19.2589,
          lng: -103.7241,
          estado: 'Pendiente',
          fecha: '2023-05-23',
          direccion: 'Esq. Av. Morelos y 5 de Mayo',
          categoria: 'Tránsito'
        }
      ];
      
      setIncidencias(mockIncidencias);
      setLoading(false);
    }, 1000);
  };

  // Refresh map data
  const handleRefresh = () => {
    cargarIncidencias();
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': '#ffd700',
      'En Proceso': '#2e86c1',
      'Resuelto': '#27ae60',
      'Cancelado': '#c0392b'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="main-container">
      <Sidebar activeItem="mapa" onNavigate={onNavigate} />
      <div className="content-container">
        <Header onLogout={onLogout} />
        <main className="main-content">
          <div className="mapa-header">
            <h1>Mapa de Incidencias</h1>
            <div className="map-actions">
              <button 
                className="btn btn-primary"
                onClick={handleRefresh}
                disabled={loading}
              >
                <FaSyncAlt className={loading ? 'spin' : ''} />
                {loading ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
          </div>

          <div className="map-container">
            {loading ? (
              <div className="loading-map">
                <div className="spinner"></div>
                <p>Cargando mapa...</p>
              </div>
            ) : (
              <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                whenCreated={(map) => {
                  mapRef.current = map;
                }}
              >
                <ChangeView center={mapCenter} zoom={zoom} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {incidencias.map((incidencia) => (
                  <Marker
                    key={incidencia.id}
                    position={[incidencia.lat, incidencia.lng]}
                    icon={getStatusIcon(incidencia.estado)}
                  >
                    <Popup>
                      <div className="popup-content">
                        <h4>{incidencia.titulo}</h4>
                        <p><strong>Categoría:</strong> {incidencia.categoria}</p>
                        <p><strong>Estado:</strong> 
                          <span style={{ color: getStatusColor(incidencia.estado) }}>
                            {incidencia.estado}
                          </span>
                        </p>
                        <p><strong>Dirección:</strong> {incidencia.direccion}</p>
                        <p><strong>Fecha:</strong> {incidencia.fecha}</p>
                        <p>{incidencia.descripcion}</p>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => onNavigate('detalle')}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                
                {/* Legend */}
                <div className="leaflet-bottom leaflet-right">
                  <div className="leaflet-control leaflet-bar">
                    <Legend />
                  </div>
                </div>
              </MapContainer>
            )}
          </div>
          
          <div className="map-info">
            <div className="info-box">
              <FaInfoCircle className="info-icon" />
              <p>Haz clic en cualquier marcador para ver los detalles de la incidencia.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapaScreen;
