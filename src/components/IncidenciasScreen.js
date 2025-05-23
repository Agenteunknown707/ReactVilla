"use client"
import { useState, useEffect } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"

function IncidenciasScreen({ onIncidenciaClick, onLogout }) {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [incidencias, setIncidencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchIncidencias()
  }, [])

  const fetchIncidencias = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/Incidencias')
      if (!response.ok) {
        throw new Error('Error al cargar las incidencias')
      }
      const data = await response.json()
      
      // Transform the data to match the required format
      const formattedIncidencias = data.map(incidencia => ({
        id: `INC-${String(incidencia.idIncidencia).padStart(3, '0')}`,
        tipo: incidencia.categoria.charAt(0).toUpperCase() + incidencia.categoria.slice(1),
        estado: incidencia.estadoReporte.charAt(0).toUpperCase() + incidencia.estadoReporte.slice(1),
        ubicacion: incidencia.ubicacion,
        fecha: new Date(incidencia.fechaCreacion).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        asignado: incidencia.dependencia || "Por definir",
        // Keep additional data that might be needed for details
        descripcion: incidencia.descripcionCiudadano,
        imagenUrl: incidencia.imagenUrl,
        coordenadas: {
          lat: incidencia.latitud,
          lng: incidencia.longitud
        }
      }))

      setIncidencias(formattedIncidencias)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar las incidencias')
      setLoading(false)
    }
  }

  const toggleDropdown = (id) => {
    if (activeDropdown === id) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(id)
    }
  }

  if (loading) {
    return (
      <div className="main-container">
        <Sidebar activeItem="incidencias" />
        <div className="content-container">
          <Header onLogout={onLogout} />
          <main className="main-content">
            <div className="loading-message">Cargando incidencias...</div>
          </main>
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
          <main className="main-content">
            <div className="error-message">{error}</div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="main-container">
      <Sidebar activeItem="incidencias" />
      <div className="content-container">
        <Header onLogout={onLogout} />
        <main className="main-content">
          <div className="incidencias-header">
            <h1>Incidencias</h1>
            <div className="search-container">
              <input type="text" placeholder="Buscar incidencias..." className="search-input" />
              <button className="search-button">
                <i className="search-icon">🔍</i>
              </button>
            </div>
            <div className="filter-container">
              <div className="filter-select-container">
                <select className="filter-select">
                  <option>Todos los tipos</option>
                  <option>Bache</option>
                  <option>Alumbrado público</option>
                  <option>Basura</option>
                  <option>Fuga de agua</option>
                </select>
              </div>
              <div className="filter-container">
                <div className="filter-select-container">
                  <select className="filter-select">
                    <option>Todos los estados</option>
                    <option>Pendiente</option>
                    <option>Resuelto</option>
                    <option>Cancelado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="incidencias-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Ubicación</th>
                  <th>Fecha</th>
                  <th>Asignado a</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.map((incidencia) => (
                  <tr key={incidencia.id}>
                    <td>{incidencia.id}</td>
                    <td>{incidencia.tipo}</td>
                    <td>
                      {incidencia.estado && (
                        <span className={`estado-badge ${incidencia.estado.replace(/\s+/g, "-").toLowerCase()}`}>
                          {incidencia.estado}
                        </span>
                      )}
                    </td>
                    <td>{incidencia.ubicacion}</td>
                    <td>{incidencia.fecha}</td>
                    <td>{incidencia.asignado}</td>
                    <td>
                      <div className="actions-dropdown">
                        <button
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleDropdown(incidencia.id)
                          }}
                        >
                          ...
                        </button>
                        {activeDropdown === incidencia.id && (
                          <div className="dropdown-menu actions-menu">
                            <option className="dropdown-item" onClick={() => onIncidenciaClick(incidencia)}>
                              Ver más detalles
                            </option>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button className="pagination-button">
              <span className="arrow">←</span> Anterior
            </button>
            <button className="pagination-button">
              Siguiente <span className="arrow">→</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default IncidenciasScreen
