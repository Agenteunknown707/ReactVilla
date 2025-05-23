"use client"
import { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"


function IncidenciasScreen({ onIncidenciaClick, onLogout }) {
  const [activeDropdown, setActiveDropdown] = useState(null)

  const incidencias = [
    {
      id: "INC-003",
      tipo: "Basura",
      estado: "En proceso",
      ubicacion: "Colonia La Villa",
      fecha: "3/3/2025",
      asignado: "Servicios Públicos",
    },
    {
      id: "INC-002",
      tipo: "undefined",
      estado: "Pendiente",
      ubicacion: "Lateral Libramiento Gobernadora Griselda Álvarez, , 28983, Ciudad de Villa de Álvarez, Colima",
      fecha: "19/5/2025",
      asignado: "Por definir",
      titulo: "Falla en alumbrado público",
      descripcion: "Tres postes de luz consecutivos sin funcionar en la calle principal de la colonia.",
    },
    {
      id: "INC-001",
      tipo: "undefined",
      estado: "Pendiente",
      ubicacion: "Avenida Niños Héroes, Real Centenario, 28984, Ciudad de Villa de Álvarez, Colima",
      fecha: "19/5/2025",
      asignado: "Por definir",
    },
    {
      id: "INC-019",
      tipo: "Suministro de agua",
      estado: "",
      ubicacion: "Colonia El Porvenir",
      fecha: "5/3/2025",
      asignado: "Por definir",
    },
    {
      id: "INC-017",
      tipo: "Calidad del agua",
      estado: "En proceso",
      ubicacion: "Colonia Las Flores",
      fecha: "7/3/2025",
      asignado: "Servicios Públicos",
    },
    {
      id: "INC-018",
      tipo: "Alcantarillado",
      estado: "En proceso",
      ubicacion: "Av. Constitución",
      fecha: "6/3/2025",
      asignado: "Agua Potable",
    },
  ]

  const toggleDropdown = (id) => {
    if (activeDropdown === id) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(id)
    }
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
