import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileExcel, FaDownload, FaEye, FaSpinner } from 'react-icons/fa';
import Header from './Header';
import Sidebar from './Sidebar';
import '../App.css';

const ReporteScreen = ({ onNavigate, onLogout }) => {
  // State for form inputs
  const [formData, setFormData] = useState({
    tipoReporte: 'completo',
    fechaInicio: '',
    fechaFin: '',
    dependencia: 'todas',
    formato: 'pdf'
  });

  // State for report history
  const [reportes, setReportes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock data for dependencies
  const dependencias = [
    { id: 'todas', nombre: 'Todas las dependencias' },
    { id: 'obras-publicas', nombre: 'Obras Públicas' },
    { id: 'servicios-urbanos', nombre: 'Servicios Urbanos' },
    { id: 'seguridad', nombre: 'Seguridad' },
    { id: 'medio-ambiente', nombre: 'Medio Ambiente' }
  ];

  // Load report history from localStorage on component mount
  useEffect(() => {
    const savedReports = localStorage.getItem('reportesGenerados');
    if (savedReports) {
      setReportes(JSON.parse(savedReports));
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate form inputs
  const validateForm = () => {
    if (!formData.fechaInicio || !formData.fechaFin) {
      setError('Por favor, ingrese ambas fechas');
      return false;
    }

    const startDate = new Date(formData.fechaInicio);
    const endDate = new Date(formData.fechaFin);
    
    if (startDate > endDate) {
      setError('La fecha de inicio no puede ser posterior a la fecha de fin');
      return false;
    }

    setError('');
    return true;
  };

  // Generate report
  const generarReporte = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const nuevoReporte = {
        id: Date.now(),
        tipo: getTipoReporteLabel(formData.tipoReporte),
        fechaGeneracion: new Date().toISOString(),
        rangoFechas: `${formData.fechaInicio} - ${formData.fechaFin}`,
        dependencia: formData.dependencia === 'todas' 
          ? 'Todas' 
          : dependencias.find(d => d.id === formData.dependencia)?.nombre || formData.dependencia,
        formato: formData.formato.toUpperCase(),
        usuario: 'Administrador',
        url: '#'
      };
      
      const updatedReports = [nuevoReporte, ...reportes];
      setReportes(updatedReports);
      localStorage.setItem('reportesGenerados', JSON.stringify(updatedReports));
      setIsLoading(false);
    }, 1500);
  };

  // Get report type label
  const getTipoReporteLabel = (tipo) => {
    switch (tipo) {
      case 'completo':
        return 'Reporte Completo';
      case 'tipo':
        return 'Incidencias por Tipo';
      case 'dependencia':
        return 'Incidencias por Dependencia';
      default:
        return 'Reporte';
    }
  };

  // Handle download
  const handleDownload = (reporte) => {
    // In a real app, this would trigger a file download
    alert(`Descargando reporte: ${reporte.tipo} (${reporte.formato})`);
  };

  // Handle preview
  const handlePreview = (reporte) => {
    // In a real app, this would open a preview modal or new tab
    alert(`Vista previa del reporte: ${reporte.tipo}`);
  };

  return (
    <div className="main-container">
      <Sidebar activeItem="reportes" onNavigate={onNavigate} />
      <div className="content-container">
        <Header onLogout={onLogout} />
        <main className="main-content">
          <div className="reporte-header">
            <h1>Generador de Reportes</h1>
            <p>Complete el formulario para generar un nuevo reporte</p>
          </div>

          {/* Report Generation Form */}
          <div className="reporte-form-container">
            <form onSubmit={generarReporte} className="reporte-form">
              <div className="form-group">
                <label htmlFor="tipoReporte">Tipo de Reporte</label>
                <select
                  id="tipoReporte"
                  name="tipoReporte"
                  value={formData.tipoReporte}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="completo">Reporte Completo</option>
                  <option value="tipo">Incidencias por Tipo</option>
                  <option value="dependencia">Incidencias por Dependencia</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fechaInicio">Fecha de Inicio</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaFin">Fecha de Fin</label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dependencia">Dependencia</label>
                <select
                  id="dependencia"
                  name="dependencia"
                  value={formData.dependencia}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  {dependencias.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Formato</label>
                <div className="format-options">
                  <label className="format-option">
                    <input
                      type="radio"
                      name="formato"
                      value="pdf"
                      checked={formData.formato === 'pdf'}
                      onChange={handleInputChange}
                    />
                    <span className="format-icon">
                      <FaFilePdf /> PDF
                    </span>
                  </label>
                  <label className="format-option">
                    <input
                      type="radio"
                      name="formato"
                      value="excel"
                      checked={formData.formato === 'excel'}
                      onChange={handleInputChange}
                    />
                    <span className="format-icon">
                      <FaFileExcel /> Excel
                    </span>
                  </label>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="btn-generar"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner" /> Generando...
                  </>
                ) : (
                  'Generar Reporte'
                )}
              </button>
            </form>
          </div>

          {/* Report History Table */}
          <div className="reporte-history">
            <h2>Historial de Reportes</h2>
            
            {reportes.length === 0 ? (
              <div className="no-reports">
                No hay reportes generados aún. Cree su primer reporte usando el formulario superior.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="reporte-table">
                  <thead>
                    <tr>
                      <th>Fecha de Generación</th>
                      <th>Tipo de Reporte</th>
                      <th>Rango de Fechas</th>
                      <th>Dependencia</th>
                      <th>Formato</th>
                      <th>Generado por</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportes.map((reporte) => (
                      <tr key={reporte.id}>
                        <td>{new Date(reporte.fechaGeneracion).toLocaleString()}</td>
                        <td>{reporte.tipo}</td>
                        <td>{reporte.rangoFechas}</td>
                        <td>{reporte.dependencia}</td>
                        <td>{reporte.formato}</td>
                        <td>{reporte.usuario}</td>
                        <td className="actions">
                          <button 
                            className="btn-action" 
                            onClick={() => handlePreview(reporte)}
                            title="Vista previa"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="btn-action" 
                            onClick={() => handleDownload(reporte)}
                            title="Descargar"
                          >
                            <FaDownload />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReporteScreen;
