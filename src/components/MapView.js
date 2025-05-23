import React, { useState } from 'react'
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '300px',
}

function MapView({ lat, lng, incidencia }) {
  const [infoOpen, setInfoOpen] = useState(false)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'TU_API_KEY_GOOGLE_MAPS', // <-- Reemplaza con tu API Key real
  })

  if (!isLoaded) return <div>Cargando mapa...</div>

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
      zoom={16}
    >
      <Marker
        position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
        onMouseOver={() => setInfoOpen(true)}
        onMouseOut={() => setInfoOpen(false)}
      >
        {infoOpen && (
          <InfoWindow position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}>
            <div>
              <p><strong>ID:</strong> {incidencia.id}</p>
              <p><strong>Tipo:</strong> {incidencia.tipo}</p>
              <p><strong>Estado:</strong> {incidencia.estado}</p>
              <p><strong>Ubicación:</strong> {incidencia.ubicacion}</p>
              <p><strong>Asignado a:</strong> {incidencia.asignado}</p>
            </div>
          </InfoWindow>
        )}
      </Marker>
    </GoogleMap>
  )
}

export default MapView
