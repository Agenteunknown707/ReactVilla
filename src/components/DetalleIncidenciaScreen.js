"use client"

import { useState, useEffect, useCallback } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import MapView from "./MapView"
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function DetalleIncidenciaScreen({ incidencia, onVolverClick, onLogout }) {
  const [activeTab, setActiveTab] = useState("detalles")
  const [incidenciaData, setIncidenciaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDependencia, setSelectedDependencia] = useState("")
  const [comentario, setComentario] = useState("")
  const [rechazarError, setRechazarError] = useState("")

  const fetchIncidenciaDetails = useCallback(async () => {
    try {
      // Extract the numeric ID from the INC-XXX format
      const idMatch = incidencia.id.match(/INC-(\d+)/)
      if (!idMatch) {
        throw new Error('Formato de ID inválido')
      }
      const id = idMatch[1]
      
      const response = await fetch(`http://localhost:4000/api/Incidencias/${id}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar los detalles de la incidencia')
      }
      
      const data = await response.json()
      setIncidenciaData(data)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar los detalles de la incidencia')
      setLoading(false)
    }
  }, [incidencia?.id])

  useEffect(() => {
    if (incidencia?.id) {
      fetchIncidenciaDetails()
    }
  }, [incidencia?.id, fetchIncidenciaDetails])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleAsignar = async () => {
    try {
      const idMatch = incidencia.id.match(/INC-(\d+)/)
      if (!idMatch) {
        throw new Error('Formato de ID inválido')
      }
      const id = idMatch[1]

      // Mapear el nombre de la dependencia a su ID
      const dependenciaIds = {
        "Obras Públicas": 1,
        "Servicios Públicos": 2,
        "Agua Potable": 3,
        "Protección Civil": 4,
        "Seguridad Pública": 5
      }

      const idDependencia = dependenciaIds[selectedDependencia]
      if (!idDependencia) {
        throw new Error('Por favor seleccione una dependencia')
      }

      const response = await fetch(`http://localhost:4000/api/Incidencias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idDependencia,
          descripcionAyuntamiento: comentario || null,
          estadoReporte: "en_proceso"
        })
      })

      if (!response.ok) {
        throw new Error('Error al asignar la incidencia')
      }

      // Actualizar los datos de la incidencia
      await fetchIncidenciaDetails()
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }

  const handleResolver = async () => {
    try {
      const idMatch = incidencia.id.match(/INC-(\d+)/)
      if (!idMatch) {
        throw new Error('Formato de ID inválido')
      }
      const id = idMatch[1]

      const response = await fetch(`http://localhost:4000/api/Incidencias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estadoReporte: "resuelto"
        })
      })

      if (!response.ok) {
        throw new Error('Error al marcar la incidencia como resuelta')
      }

      // Actualizar los datos de la incidencia
      await fetchIncidenciaDetails()
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }

  const handleRechazar = async () => {
    try {
      if (!comentario.trim()) {
        setRechazarError("Debe escribir un motivo para rechazar la incidencia")
        return
      }

      setRechazarError("")
      const idMatch = incidencia.id.match(/INC-(\d+)/)
      if (!idMatch) {
        throw new Error('Formato de ID inválido')
      }
      const id = idMatch[1]

      const response = await fetch(`http://localhost:4000/api/Incidencias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcionAyuntamiento: comentario,
          estadoReporte: "rechazado"
        })
      })

      if (!response.ok) {
        throw new Error('Error al rechazar la incidencia')
      }

      // Actualizar los datos de la incidencia
      await fetchIncidenciaDetails()
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="main-container">
        <Sidebar activeItem="incidencias" />
        <div className="content-container">
          <Header onLogout={onLogout} />
          <div className="loading-message">Cargando detalles...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="main-container">
        <Sidebar activeItem="incidencias" />
        <div className="content-container">
          <Header onLogout={onLogout} />
          <div className="error-message">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-container">
      <Sidebar activeItem="incidencias" />
      <div className="content-container">
        <Header onLogout={onLogout} />
        <div className="detalle-header">
          <button className="volver-button" onClick={onVolverClick}>
            ← 
          </button>
          <h2 className="detalle-id">{incidencia.id}</h2>
        </div>

        <div className="detalle-content">
          <div className="detalle-main">
            <div className="detalle-title-container">
              <h1 className="detalle-title">
                {incidenciaData?.categoria.charAt(0).toUpperCase() + incidenciaData?.categoria.slice(1)} en {incidenciaData?.ubicacion}
              </h1>
              <span className={`estado-badge ${incidenciaData?.estadoReporte.toLowerCase()}`}>
                {incidenciaData?.estadoReporte.charAt(0).toUpperCase() + incidenciaData?.estadoReporte.slice(1)}
              </span>
            </div>
            <p className="detalle-fecha">Reportada el {formatDate(incidenciaData?.createdAt)}</p>

            <div className="detalle-tabs">
              <button
                className={`tab-button ${activeTab === "detalles" ? "active" : ""}`}
                onClick={() => setActiveTab("detalles")}
              >
                Detalles
              </button>
              <button
                className={`tab-button ${activeTab === "imagenes" ? "active" : ""}`}
                onClick={() => setActiveTab("imagenes")}
              >
                Imágenes
              </button>
              <button
                className={`tab-button ${activeTab === "ubicacion" ? "active" : ""}`}
                onClick={() => setActiveTab("ubicacion")}
              >
                Ubicación
              </button>
            </div>

            <div className="detalle-tab-content">
              {activeTab === "detalles" && (
                <div className="detalles-content">
                  <h3>Descripción</h3>
                  <p>{incidenciaData?.descripcionCiudadano}</p>

                  <div className="detalle-info-grid">
                    <div className="info-item">
                      <h4>Tipo</h4>
                      <p>{incidenciaData?.categoria.charAt(0).toUpperCase() + incidenciaData?.categoria.slice(1)}</p>
                    </div>
                    <div className="info-item">
                      <h4>Asignado a</h4>
                      <p>{incidenciaData?.dependencia || "Por definir"}</p>
                    </div>
                  </div>

                  <div className="detalle-info-grid">
                    <div className="info-item">
                      <h4>Última actualización</h4>
                      <p>{formatDate(incidenciaData?.updatedAt)}</p>
                    </div>
                  </div>

                  <button className="resolver-button" onClick={handleResolver}>
                    <span className="check-icon">✓</span> Marcar como resuelto
                  </button>

                  <div className="ciudadano-info">
                    <h3>Información del Ciudadano</h3>
                    <div className="ciudadano-grid">
                      <div className="ciudadano-item">
                        <h4>Nombre:</h4>
                        <p>{`${incidenciaData?.ciudadano.nombre} ${incidenciaData?.ciudadano.apellido}`}</p>
                      </div>
                      <div className="ciudadano-item">
                        <h4>Correo electrónico:</h4>
                        <p>{incidenciaData?.ciudadano.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="historial-cambios">
                    <h3>Historial de Cambios</h3>
                    <p className="historial-subtitle">Registro de actualizaciones de la incidencia</p>
                  </div>
                </div>
              )}

              {activeTab === "imagenes" && (
                <div className="imagenes-content">
                  {incidenciaData?.imagenUrl ? (
                    <img 
                      src={`http://localhost:4000${incidenciaData.imagenUrl}`} 
                      alt="Imagen de la incidencia"
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                  ) : (
                    <p>No hay imágenes disponibles</p>
                  )}
                </div>
              )}

              {activeTab === "ubicacion" && (
                <div className="ubicacion-content">
                  {incidenciaData?.latitud && incidenciaData?.longitud ? (
                    <MapView 
                      lat={incidenciaData.latitud} 
                      lng={incidenciaData.longitud} 
                      incidencia={incidenciaData}
                    />
                  ) : (
                    <p>No hay coordenadas disponibles para mostrar el mapa</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="detalle-sidebar">
            <div className="asignar-container">
              <h3>Asignar Incidencia</h3>
              <p>Asigna esta incidencia a una dependencia municipal</p>

              <div className="form-group">
                <label>Dependencia</label>
                <select 
                  className="dependencia-select"
                  value={selectedDependencia}
                  onChange={(e) => setSelectedDependencia(e.target.value)}
                >
                  <option value="">Seleccionar dependencia</option>
                  <option value="Obras Públicas">Obras Públicas</option>
                  <option value="Servicios Públicos">Servicios Públicos</option>
                  <option value="Agua Potable">Agua Potable</option>
                  <option value="Protección Civil">Protección Civil</option>
                  <option value="Seguridad Pública">Seguridad Pública</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comentario</label>
                <textarea
                  placeholder="Añade instrucciones o detalles adicionales..."
                  className="comentario-textarea"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                ></textarea>
              </div>

              <button className="asignar-button" onClick={handleAsignar}>Asignar Incidencia</button>

              <div className="verificacion-container">
                <h3>Verificación de Incidencia</h3>
                <p>Si esta incidencia no es válida, puede rechazarla</p>

                <div className="form-group">
                  <label>Motivo de rechazo</label>
                  <textarea
                    placeholder="Escriba el motivo por el que rechaza esta incidencia..."
                    className="comentario-textarea"
                    value={comentario}
                    onChange={(e) => {
                      setComentario(e.target.value)
                      setRechazarError("")
                    }}
                  ></textarea>
                  {rechazarError && (
                    <p className="rechazar-error-message">
                      {rechazarError}
                    </p>
                  )}
                </div>

                <button className="rechazar-button" onClick={handleRechazar}>✕ Rechazar Incidencia</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleIncidenciaScreen
