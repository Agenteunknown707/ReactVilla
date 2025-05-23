"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import MapView from "./MapView"

function DetalleIncidenciaScreen({ incidencia, onVolverClick, onLogout }) {
  const [activeTab, setActiveTab] = useState("detalles")

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
              <h1 className="detalle-title">{incidencia.titulo || "Falla en alumbrado público"}</h1>
              <span className="estado-badge pendiente">Pendiente</span>
            </div>
            <p className="detalle-fecha">Reportada el 4/3/2025</p>

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
                  <p>
                    {incidencia.descripcion ||
                      "Tres postes de luz consecutivos sin funcionar en la calle principal de la colonia."}
                  </p>

                  <div className="detalle-info-grid">
                    <div className="info-item">
                      <h4>Tipo</h4>
                      <p>Alumbrado público</p>
                    </div>
                    <div className="info-item">
                      <h4>Asignado a</h4>
                      <p>Por definir</p>
                    </div>
                  </div>

                  <div className="detalle-info-grid">
                    <div className="info-item">
                      <h4>Última actualización</h4>
                      <p>4/3/2025</p>
                    </div>
                  </div>

                  <button className="resolver-button">
                    <span className="check-icon">✓</span> Marcar como resuelto
                  </button>

                  <div className="ciudadano-info">
                    <h3>Información del Ciudadano</h3>
                    <div className="ciudadano-grid">
                      <div className="ciudadano-item">
                        <h4>Nombre:</h4>
                        <p>María González</p>
                      </div>
                      <div className="ciudadano-item">
                        <h4>Correo electrónico:</h4>
                        <p>maria.gonzalez@ejemplo.com</p>
                      </div>
                      <div className="ciudadano-item">
                        <h4>Teléfono:</h4>
                        <p>312-234-5678</p>
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
                  <div className="imagenes-grid">
                    <div className="imagen-cuadro">
                      {incidencia.imagenUrl ? (
                        <img
                          src={incidencia.imagenUrl}
                          alt="Imagen de la incidencia"
                          className="incidencia-imagen"
                        />
                      ) : (
                        <div className="imagen-placeholder">
                          <p>No hay imagen disponible para esta incidencia.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="historial-cambios">
                    <h3>Historial de Cambios</h3>
                    <p className="historial-subtitle">Registro de actualizaciones de la incidencia</p>
                  </div>

                </div>
              )}

              {activeTab === "ubicacion" && (
                <div className="ubicacion-content">
                  <MapView
                    lat={incidencia.coordenadas.lat}
                    lng={incidencia.coordenadas.lng}
                    incidencia={incidencia}
                  />
                  <div className="historial-cambios">
                    <h3>Historial de Cambios</h3>
                    <p className="historial-subtitle">Registro de actualizaciones de la incidencia</p>
                  </div>

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
                <select className="dependencia-select">
                  <option>Seleccionar dependencia</option>
                  <option>Servicios Públicos</option>
                  <option>Agua Potable</option>
                  <option>Alumbrado público</option>
                </select>
              </div>

              <div className="form-group">
                <label>Comentario</label>
                <textarea
                  placeholder="Añade instrucciones o detalles adicionales..."
                  className="comentario-textarea"
                ></textarea>
              </div>

              <button className="asignar-button">Asignar Incidencia</button>

              <div className="verificacion-container">
                <h3>Verificación de Incidencia</h3>
                <p>Si esta incidencia no es válida, puede rechazarla</p>

                <button className="rechazar-button">✕ Rechazar Incidencia</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleIncidenciaScreen
