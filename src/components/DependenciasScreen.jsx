import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import Header from './Header';
import Sidebar from './Sidebar';
import '../App.css';

const DependenciasScreen = ({ onNavigate, onLogout }) => {
  // State for dependencies list and form
  const [dependencias, setDependencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dependenciaToDelete, setDependenciaToDelete] = useState(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [currentDependencia, setCurrentDependencia] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    responsable: '',
    email: '',
    telefono: '',
    estado: 'Activo'
  });

  // Access form state
  const [accessData, setAccessData] = useState({
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    acceso: 'Activo'
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Load dependencies on component mount
  useEffect(() => {
    cargarDependencias();
  }, []);

  // Mock function to load dependencies (replace with API call)
  const cargarDependencias = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockData = [
        {
          id: 1,
          nombre: 'Obras Públicas',
          responsable: 'Juan Pérez',
          email: 'juan.perez@ejemplo.com',
          telefono: '555-123-4567',
          estado: 'Activo',
          acceso: 'Activo'
        },
        {
          id: 2,
          nombre: 'Servicios Públicos',
          responsable: 'María García',
          email: 'maria.garcia@ejemplo.com',
          telefono: '555-987-6543',
          estado: 'Activo',
          acceso: 'Inactivo'
        },
        {
          id: 3,
          nombre: 'Medio Ambiente',
          responsable: 'Carlos López',
          email: 'carlos.lopez@ejemplo.com',
          telefono: '555-456-7890',
          estado: 'Inactivo',
          acceso: 'Inactivo'
        }
      ];
      setDependencias(mockData);
      setLoading(false);
    }, 500);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle access form input changes
  const handleAccessInputChange = (e) => {
    const { name, value } = e.target;
    setAccessData({
      ...accessData,
      [name]: value
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9\-\+\(\)\s]{10,20}$/;
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.responsable.trim()) {
      newErrors.responsable = 'El responsable es requerido';
    }
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }
    
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = 'Ingrese un teléfono válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate access form
  const validateAccessForm = () => {
    const newErrors = {};
    
    if (!accessData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    }
    
    if (!accessData.contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (accessData.contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (accessData.contrasena !== accessData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingId) {
      // Update existing dependency
      setDependencias(dependencias.map(dep => 
        dep.id === editingId ? { ...formData, id: editingId } : dep
      ));
    } else {
      // Add new dependency
      const newDependency = {
        ...formData,
        id: Date.now(),
        acceso: 'Inactivo' // Default access status
      };
      setDependencias([newDependency, ...dependencias]);
    }
    
    // Reset form and close
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      responsable: '',
      email: '',
      telefono: '',
      estado: 'Activo'
    });
  };

  // Handle edit button click
  const handleEdit = (dependencia) => {
    setFormData({
      nombre: dependencia.nombre,
      responsable: dependencia.responsable,
      email: dependencia.email,
      telefono: dependencia.telefono,
      estado: dependencia.estado
    });
    setEditingId(dependencia.id);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDeleteClick = (dependencia) => {
    setDependenciaToDelete(dependencia);
    setShowConfirm(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    setDependencias(dependencias.filter(dep => dep.id !== dependenciaToDelete.id));
    setShowConfirm(false);
    setDependenciaToDelete(null);
  };

  // Handle access button click
  const handleAccessClick = (dependencia) => {
    setCurrentDependencia(dependencia);
    setAccessData({
      usuario: '',
      contrasena: '',
      confirmarContrasena: '',
      acceso: dependencia.acceso || 'Inactivo'
    });
    setShowAccessModal(true);
  };

  // Handle access form submission
  const handleAccessSubmit = (e) => {
    e.preventDefault();
    
    if (!validateAccessForm()) return;
    
    // Update dependency with new access data
    setDependencias(dependencias.map(dep => 
      dep.id === currentDependencia.id 
        ? { ...dep, acceso: accessData.acceso } 
        : dep
    ));
    
    // Reset and close modal
    setShowAccessModal(false);
    setCurrentDependencia(null);
  };

  // Toggle dependency status
  const toggleStatus = (id) => {
    setDependencias(dependencias.map(dep => 
      dep.id === id 
        ? { ...dep, estado: dep.estado === 'Activo' ? 'Inactivo' : 'Activo' } 
        : dep
    ));
  };

  // Toggle access status
  const toggleAccessStatus = (id) => {
    setDependencias(dependencias.map(dep => 
      dep.id === id 
        ? { ...dep, acceso: dep.acceso === 'Activo' ? 'Inactivo' : 'Activo' } 
        : dep
    ));
  };

  return (
    <div className="main-container">
      <Sidebar activeItem="dependencias" onNavigate={onNavigate} />
      <div className="content-container">
        <Header onLogout={onLogout} />
        <main className="main-content">
          <div className="dependencias-header">
            <h1>Gestión de Dependencias</h1>
            <button 
              className=" btn btn-primary"
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({
                  nombre: '',
                  responsable: '',
                  email: '',
                  telefono: '',
                  estado: 'Activo'
                });
              }}
            >
              <FaPlus /> Agregar Dependencia
            </button>
          </div>

          {/* Dependencies Table */}
          <div className="table-responsive">
            <table className="dependencias-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Responsable</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="loading-cell">Cargando dependencias...</td>
                  </tr>
                ) : dependencias.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">No hay dependencias registradas</td>
                  </tr>
                ) : (
                  dependencias.map((dependencia) => (
                    <tr key={dependencia.id}>
                      <td>{dependencia.nombre}</td>
                      <td>{dependencia.responsable}</td>
                      <td>{dependencia.email}</td>
                      <td>{dependencia.telefono}</td>
                      <td>
                        <span 
                          className={`status-badge ${dependencia.estado === 'Activo' ? 'active' : 'inactive'}`}
                          onClick={() => toggleStatus(dependencia.id)}
                        >
                          {dependencia.estado}
                        </span>
                      </td>
                      <td>
                        <span 
                          className={`access-badge ${dependencia.acceso === 'Activo' ? 'active' : 'inactive'}`}
                          onClick={() => toggleAccessStatus(dependencia.id)}
                        >
                          {dependencia.acceso === 'Activo' ? 'Acceso Activo' : 'Acceso Restringido'}
                        </span>
                      </td>
                      <td className="actions">
                        <button 
                          className=" btn btn-icon" 
                          onClick={() => handleEdit(dependencia)}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className=" btn btn-icon btn-delete" 
                          onClick={() => handleDeleteClick(dependencia)}
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                        <button 
                          className=" btn btn-icon btn-access" 
                          onClick={() => handleAccessClick(dependencia)}
                          title="Gestionar Acceso"
                        >
                          <FaLock />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Dependencia Form Modal */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>{editingId ? 'Editar Dependencia' : 'Agregar Nueva Dependencia'}</h2>
                  <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="form-group">
                    <label>Nombre de la Dependencia*</label>
                    <input 
                      type="text" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={errors.nombre ? 'error' : ''}
                    />
                    {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Responsable*</label>
                    <input 
                      type="text" 
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleInputChange}
                      className={errors.responsable ? 'error' : ''}
                    />
                    {errors.responsable && <span className="error-message">{errors.responsable}</span>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email*</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Teléfono*</label>
                      <input 
                        type="tel" 
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className={errors.telefono ? 'error' : ''}
                      />
                      {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Estado</label>
                    <select 
                      name="estado" 
                      value={formData.estado}
                      onChange={handleInputChange}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className=" btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className=" btn btn-primary">
                      {editingId ? 'Actualizar' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showConfirm && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Confirmar Eliminación</h2>
                  <button className="btn close-btn" onClick={() => setShowConfirm(false)}>×</button>
                </div>
                <div className="modal-body">
                  <p>¿Está seguro de eliminar la dependencia <strong>{dependenciaToDelete?.nombre}</strong>?</p>
                  <p>Esta acción no se puede deshacer.</p>
                </div>
                <div className="modal-actions">
                  <button 
                    className=" btn btn-secondary"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className=" btn btn-danger"
                    onClick={confirmDelete}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Access Management Modal */}
          {showAccessModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Gestión de Acceso</h2>
                  <button className=" btn close-btn" onClick={() => setShowAccessModal(false)}>×</button>
                </div>
                <form onSubmit={handleAccessSubmit} className="modal-form">
                  <div className="form-group">
                    <label>Dependencia</label>
                    <input 
                      type="text" 
                      value={currentDependencia?.nombre}
                      disabled 
                      className="disabled"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Usuario*</label>
                    <input 
                      type="text" 
                      name="usuario"
                      value={accessData.usuario}
                      onChange={handleAccessInputChange}
                      className={errors.usuario ? 'error' : ''}
                      placeholder="Nombre de usuario para acceso"
                    />
                    {errors.usuario && <span className="error-message">{errors.usuario}</span>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Contraseña*</label>
                      <input 
                        type="password" 
                        name="contrasena"
                        value={accessData.contrasena}
                        onChange={handleAccessInputChange}
                        className={errors.contrasena ? 'error' : ''}
                        placeholder="Mínimo 6 caracteres"
                      />
                      {errors.contrasena && <span className="error-message">{errors.contrasena}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Confirmar Contraseña*</label>
                      <input 
                        type="password" 
                        name="confirmarContrasena"
                        value={accessData.confirmarContrasena}
                        onChange={handleAccessInputChange}
                        className={errors.confirmarContrasena ? 'error' : ''}
                      />
                      {errors.confirmarContrasena && (
                        <span className="error-message">{errors.confirmarContrasena}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Estado de Acceso</label>
                    <select 
                      name="acceso" 
                      value={accessData.acceso}
                      onChange={handleAccessInputChange}
                    >
                      <option value="Activo">Acceso Activo</option>
                      <option value="Inactivo">Acceso Restringido</option>
                    </select>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className=" btn btn-secondary"
                      onClick={() => setShowAccessModal(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className=" btn btn-primary">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DependenciasScreen;
