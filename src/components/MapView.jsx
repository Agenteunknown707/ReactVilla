import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Corregir los íconos del marcador para que se vean bien
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

function MapView({ lat, lng, incidencia }) {
  const position = [parseFloat(lat), parseFloat(lng)]

  return (
    <MapContainer center={position} zoom={16} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={position}>
        <Popup>
          <p><strong>ID:</strong> {incidencia?.id}</p>
          <p><strong>Tipo:</strong> {incidencia?.tipo}</p>
          <p><strong>Estado:</strong> {incidencia?.estado}</p>
          <p><strong>Ubicación:</strong> {incidencia?.ubicacion}</p>
          <p><strong>Asignado a:</strong> {incidencia?.asignado}</p>
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default MapView