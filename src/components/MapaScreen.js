import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { FaSyncAlt, FaInfoCircle } from 'react-icons/fa';
import Header from './Header';
import Sidebar from './Sidebar';
import { API_ENDPOINTS } from '../config/api';
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

  // Function to load incidents from API
  const cargarIncidencias = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.INCIDENCIAS);
      
      if (!response.ok) {
        throw new Error('Error al cargar las incidencias');
      }
      
      const data = await response.json();
      
      // Filter incidencias that have valid coordinates
      const incidenciasConCoordenadas = data.filter(incidencia => 
        incidencia.latitud && incidencia.longitud && 
        incidencia.latitud !== 0 && incidencia.longitud !== 0
      ).map(incidencia => ({
        id: incidencia.id,
        titulo: incidencia.titulo || incidencia.descripcion || 'Sin título',
        descripcion: incidencia.descripcion || 'Sin descripción',
        lat: parseFloat(incidencia.latitud),
        lng: parseFloat(incidencia.longitud),
        estado: incidencia.estado || 'Pendiente',
        fecha: incidencia.fechaCreacion || incidencia.fecha || new Date().toISOString().split('T')[0],
        direccion: incidencia.ubicacion || incidencia.direccion || 'Sin dirección',
        categoria: incidencia.categoria || incidencia.tipo || 'General'
      }));
      
      setIncidencias(incidenciasConCoordenadas);
    } catch (error) {
      console.error('Error cargando incidencias:', error);
      // Fallback to mock data if API fails
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
        }
      ];
      setIncidencias(mockIncidencias);
    } finally {
      setLoading(false);
    }
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
