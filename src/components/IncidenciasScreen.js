"use client"
import React, { useState, useEffect } from "react"
import { API_ENDPOINTS } from "../config/api"

function IncidenciasScreen({ onIncidenciaClick, onLogout, onNavigate }) {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [incidencias, setIncidencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchIncidencias()
  }, [])

  const fetchIncidencias = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.INCIDENCIAS)
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
      <div className="loading-container">
        <div className="spinner"></div>
        <span>Cargando incidencias...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchIncidencias} className="btn btn-primary">Reintentar</button>
      </div>
    )
  }

  // Filter incidencias based on search and filters
  const filteredIncidencias = incidencias.filter(incidencia => {
    const matchesSearch = incidencia.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incidencia.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !tipoFiltro || incidencia.tipo === tipoFiltro;
    const matchesEstado = !estadoFiltro || incidencia.estado.toLowerCase() === estadoFiltro.toLowerCase();
    
    return matchesSearch && matchesTipo && matchesEstado;
  });

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Incidencias</h3>
          <div className="header-controls">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Buscar por ubicación o ID..." 
                className="form-control" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary">
                🔍
              </button>
            </div>
            <div className="filter-container">
              <select 
                className="form-control"
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="Bache">Bache</option>
                <option value="Alumbrado">Alumbrado público</option>
                <option value="Basura">Basura</option>
                <option value="Agua">Fuga de agua</option>
              </select>
              <select 
                className="form-control"
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="resuelto">Resuelto</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
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
              {filteredIncidencias.length > 0 ? (
                filteredIncidencias.map((incidencia) => (
                  <tr key={incidencia.id}>
                    <td>{incidencia.id}</td>
                    <td>{incidencia.tipo}</td>
                    <td>
                      {incidencia.estado && (
                        <span className={`estado-badge ${incidencia.estado.toLowerCase().replace(/\s+/g, "-")}`}>
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
                          className="btn btn-sm btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleDropdown(incidencia.id)
                          }}
                        >
                          ...
                        </button>
                        {activeDropdown === incidencia.id && (
                          <div className="dropdown-menu actions-menu">
                            <button className="dropdown-item" onClick={() => onIncidenciaClick(incidencia)}>
                              Ver más detalles
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    No se encontraron incidencias que coincidan con los filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="btn btn-secondary">
            ← Anterior
          </button>
          <button className="btn btn-secondary">
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  )
}

export default IncidenciasScreen
