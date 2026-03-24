import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaUser, FaCog, FaFileAlt, FaSort, FaSortUp, FaSortDown, FaSync, FaTrash, FaEye } from 'react-icons/fa';
import Header from './Header';
import Sidebar from './Sidebar';
import '../App.css';

function BitacoraScreen({ onNavigate, onLogout }) {
  // State for logs data
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for filters
  const [filters, setFilters] = useState({
    usuario: '',
    accion: '',
    modulo: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // State for sorting and pagination
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for logs
  const mockLogs = [
    {
      id: 1,
      usuario: 'admin@municipalidad.gob',
      accion: 'Creó incidencia',
      modulo: 'Incidencias',
      fecha: new Date('2024-03-23T10:30:00'),
      detalles: 'Nueva incidencia de bache en Av. Principal'
    },
    {
      id: 2,
      usuario: 'juan.perez@ejemplo.com',
      accion: 'Editó usuario',
      modulo: 'Usuarios',
      fecha: new Date('2024-03-23T09:15:00'),
      detalles: 'Modificó información del usuario María García'
    },
    {
      id: 3,
      usuario: 'maria.garcia@ejemplo.com',
      accion: 'Eliminó dependencia',
      modulo: 'Dependencias',
      fecha: new Date('2024-03-23T08:45:00'),
      detalles: 'Eliminó dependencia "Dirección de Obras Públicas"'
    },
    {
      id: 4,
      usuario: 'admin@municipalidad.gob',
      accion: 'Generó reporte',
      modulo: 'Reportes',
      fecha: new Date('2024-03-22T16:20:00'),
      detalles: 'Reporte de incidencias - Últimos 30 días'
    },
    {
      id: 5,
      usuario: 'carlos.lopez@ejemplo.com',
      accion: 'Actualizó configuración',
      modulo: 'Configuración',
      fecha: new Date('2024-03-22T14:10:00'),
      detalles: 'Cambió configuración del sistema'
    }
  ];

  // Load logs on component mount
  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLogs(mockLogs);
    } catch (err) {
      setError('Error al cargar la bitácora');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Apply filters to logs
  const filteredLogs = logs.filter(log => {
    const matchesUsuario = !filters.usuario || 
      log.usuario.toLowerCase().includes(filters.usuario.toLowerCase());
    
    const matchesAccion = !filters.accion || 
      log.accion.toLowerCase().includes(filters.accion.toLowerCase());
    
    const matchesModulo = !filters.modulo || 
      log.modulo === filters.modulo;
    
    const matchesFechaDesde = !filters.fechaDesde || 
      log.fecha >= new Date(filters.fechaDesde);
    
    const matchesFechaHasta = !filters.fechaHasta || 
      log.fecha <= new Date(filters.fechaHasta + 'T23:59:59');
    
    return matchesUsuario && matchesAccion && matchesModulo && matchesFechaDesde && matchesFechaHasta;
  });

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      usuario: '',
      accion: '',
      modulo: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    setCurrentPage(1);
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get unique values for dropdowns
  const uniqueUsuarios = [...new Set(logs.map(log => log.usuario))];
  const uniqueAcciones = [...new Set(logs.map(log => log.accion))];
  const uniqueModulos = [...new Set(logs.map(log => log.modulo))];

  return (
    <div className="main-container">
      <Sidebar activeItem="bitacora" onNavigate={onNavigate} />
      <div className="content-container">
        <Header onLogout={onLogout} />
        <main className="main-content">
          <div className="bitacora-header">
            <h1>Bitácora del Sistema</h1>
            <p>Registro de todas las actividades realizadas en el sistema</p>
          </div>

          {/* Filters Card */}
          <div className="bitacora-filters-card">
            <div className="filters-header">
              <h3><FaFilter /> Filtros</h3>
              <button className="btn-clear-filters" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
            
            <div className="filters-grid">
              <div className="filter-group">
                <label><FaUser /> Usuario</label>
                <select
                  value={filters.usuario}
                  onChange={(e) => handleFilterChange('usuario', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos los usuarios</option>
                  {uniqueUsuarios.map(usuario => (
                    <option key={usuario} value={usuario}>{usuario}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label><FaFileAlt /> Acción</label>
                <select
                  value={filters.accion}
                  onChange={(e) => handleFilterChange('accion', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todas las acciones</option>
                  {uniqueAcciones.map(accion => (
                    <option key={accion} value={accion}>{accion}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label><FaCog /> Módulo</label>
                <select
                  value={filters.modulo}
                  onChange={(e) => handleFilterChange('modulo', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos los módulos</option>
                  {uniqueModulos.map(modulo => (
                    <option key={modulo} value={modulo}>{modulo}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label><FaCalendarAlt /> Fecha Desde</label>
                <input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label><FaCalendarAlt /> Fecha Hasta</label>
                <input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>
          </div>

          {/* Logs Table Card */}
          <div className="bitacora-table-card">
            <div className="table-header">
              <h3>Registros del Sistema</h3>
              <div className="table-actions">
                <span className="total-records">
                  {filteredLogs.length} registros encontrados
                </span>
                <button className="btn-refresh" onClick={loadLogs}>
                  <FaSync /> Actualizar
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <span>Cargando registros...</span>
              </div>
            ) : error ? (
              <div className="error-container">
                <span>{error}</span>
                <button onClick={loadLogs} className="btn-retry">Reintentar</button>
              </div>
            ) : paginatedLogs.length === 0 ? (
              <div className="empty-container">
                <FaFileAlt className="empty-icon" />
                <h3>No se encontraron registros</h3>
                <p>No hay actividades que coincidan con los filtros seleccionados</p>
                <button onClick={clearFilters} className="btn-clear">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="bitacora-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('usuario')} className="sortable">
                          Usuario {getSortIcon('usuario')}
                        </th>
                        <th onClick={() => handleSort('accion')} className="sortable">
                          Acción {getSortIcon('accion')}
                        </th>
                        <th onClick={() => handleSort('modulo')} className="sortable">
                          Módulo {getSortIcon('modulo')}
                        </th>
                        <th onClick={() => handleSort('fecha')} className="sortable">
                          Fecha {getSortIcon('fecha')}
                        </th>
                        <th>Detalles</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLogs.map(log => (
                        <tr key={log.id}>
                          <td>{log.usuario}</td>
                          <td>{log.accion}</td>
                          <td>
                            <span className="modulo-badge">{log.modulo}</span>
                          </td>
                          <td>{formatDate(log.fecha)}</td>
                          <td>{log.detalles}</td>
                          <td>
                            <button className="btn-action" title="Ver detalles">
                              <FaEye />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-button"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Anterior
                    </button>
                    <span className="pagination-info">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      className="pagination-button"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default BitacoraScreen;
