import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaLock, FaCheck, FaTimes, FaUsers, FaBuilding, FaUserTag, FaEye } from 'react-icons/fa';
import Sidebar from './Sidebar';
import '../App.css';
import '../styles/DependenciasUsuarios.css';

const DependenciasScreen = ({ onNavigate, onLogout }) => {
  // State for dependencies list and form
  const [dependencias, setDependencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // New state for users
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dependenciaToDelete, setDependenciaToDelete] = useState(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [currentDependencia, setCurrentDependencia] = useState(null);
  const [showUsersModal, setShowUsersModal] = useState(false); // New state for users modal
  const [selectedDependenciaUsers, setSelectedDependenciaUsers] = useState([]); // New state for selected dependency users
  
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

  // Load dependencies and users on component mount
  useEffect(() => {
    cargarDependencias();
    cargarUsuarios(); // Load users data
  }, []);

  // Mock function to load users (replace with API call)
  const cargarUsuarios = () => {
    // Mock users data - same as in PanelUsuarios
    const mockUsers = [
      { id: 1, nombre: 'Juan Pérez', correo: 'juan.perez@colima.gob.mx', rol: 'Administrador', dependencia: 'Dirección de Obras Públicas', estado: 'activo', dependencia_id: 1 },
      { id: 2, nombre: 'María González', correo: 'maria.gonzalez@colima.gob.mx', rol: 'Operador', dependencia: 'Dirección de Servicios Públicos Municipales', estado: 'activo', dependencia_id: 4 },
      { id: 3, nombre: 'Carlos Rodríguez', correo: 'carlos.rodriguez@colima.gob.mx', rol: 'Usuario', dependencia: 'Protección Civil', estado: 'inactivo', dependencia_id: 8 },
      { id: 4, nombre: 'Ana Martínez', correo: 'ana.martinez@colima.gob.mx', rol: 'Operador', dependencia: 'Comisión o Dirección de Agua Potable CIAPACOV', estado: 'bloqueado', dependencia_id: 3 },
      { id: 5, nombre: 'Luis Sánchez', correo: 'luis.sanchez@colima.gob.mx', rol: 'Usuario', dependencia: 'Dirección de Parques y Jardines', estado: 'activo', dependencia_id: 5 },
      { id: 6, nombre: 'Patricia López', correo: 'patricia.lopez@colima.gob.mx', rol: 'Administrador', dependencia: 'Dirección de Obras Públicas', estado: 'activo', dependencia_id: 1 },
      { id: 7, nombre: 'Roberto Díaz', correo: 'roberto.diaz@colima.gob.mx', rol: 'Operador', dependencia: 'Dirección de Servicios Públicos Municipales', estado: 'activo', dependencia_id: 4 },
      { id: 8, nombre: 'Sofía Hernández', correo: 'sofia.hernandez@colima.gob.mx', rol: 'Usuario', dependencia: 'Protección Civil', estado: 'inactivo', dependencia_id: 8 },
    ];
    setUsuarios(mockUsers);
  };

  // Load dependencies on component mount
  const cargarDependencias = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock data with categories
      const mockData = [
        {
          id: 1,
          nombre: 'Dirección de Obras Públicas',
          responsable: 'Juan Pérez',
          email: 'juan.perez@ejemplo.com',
          telefono: '555-123-4567',
          estado: 'Activo',
          acceso: 'Activo',
          categorias: ['Baches', 'Señalamiento', 'Alcantarillado', 'Pavimento']
        },
        {
          id: 2,
          nombre: 'Dirección de Alumbrado Público',
          responsable: 'María García',
          email: 'maria.garcia@ejemplo.com',
          telefono: '555-987-6543',
          estado: 'Activo',
          acceso: 'Activo',
          categorias: ['Luminarias', 'Postes', 'Cables', 'Transformadores']
        },
        {
          id: 3,
          nombre: 'Comisión o Dirección de Agua Potable CIAPACOV',
          responsable: 'Carlos López',
          email: 'carlos.lopez@ejemplo.com',
          telefono: '555-456-7890',
          estado: 'Activo',
          acceso: 'Activo',
          categorias: ['Fugas', 'Conexiones', 'Calidad del Agua', 'Tuberías']
        },
        {
          id: 4,
          nombre: 'Dirección de Servicios Públicos Municipales',
          responsable: 'Ana Martínez',
          email: 'ana.martinez@ejemplo.com',
          telefono: '555-234-5678',
          estado: 'Activo',
          acceso: 'Activo',
          categorias: ['Limpieza', 'Alumbrado', 'Parques', 'Basura']
        },
        {
          id: 5,
          nombre: 'Dirección de Parques y Jardines',
          responsable: 'Roberto Sánchez',
          email: 'roberto.sanchez@ejemplo.com',
          telefono: '555-345-6789',
          estado: 'Activo',
          acceso: 'Activo',
          categorias: ['Mantenimiento', 'Riego', 'Podas', 'Jardinería']
        },
        {
          id: 6,
          nombre: 'Dirección de Ecología o Medio Ambiente',
          responsable: 'Laura Hernández',
          email: 'laura.hernandez@ejemplo.com',
          telefono: '555-456-7890',
          estado: 'Activo',
          acceso: 'Activo',
          categorias: ['Reciclaje', 'Contaminación', 'Conservación', 'Educación Ambiental']
        },
        {
          id: 7,
          nombre: 'Dirección de Tránsito o Movilidad Municipal',
          responsable: 'Miguel Ángel Torres',
          email: 'miguel.torres@ejemplo.com',
          telefono: '555-567-8901',
          estado: 'Activo',
          acceso: 'Activo',
          categorias: ['Señales', 'Semáforos', 'Velocidad', 'Estacionamiento']
        },
        {
          id: 8,
          nombre: 'Protección Civil',
          responsable: 'Diana Ruiz',
          email: 'diana.ruiz@ejemplo.com',
          telefono: '555-678-9012',
          estado: 'Activo',
          acceso: 'Activo',
          categorias: ['Emergencias', 'Prevención', 'Evacuación', 'Simulacros']
        }
      ];
      setDependencias(mockData);
      setLoading(false);
    }, 500);
  };

  // Get users for a specific dependency
  const getUsuariosPorDependencia = (dependenciaId) => {
    return usuarios.filter(usuario => usuario.dependencia_id === dependenciaId);
  };

  // Handle showing users modal
  const handleShowUsers = (dependencia) => {
    const usuariosDeDependencia = getUsuariosPorDependencia(dependencia.id);
    setSelectedDependenciaUsers(usuariosDeDependencia);
    setCurrentDependencia(dependencia);
    setShowUsersModal(true);
  };

  // Get estado badge class
  const getEstadoBadgeClass = (estado) => {
    const classes = {
      activo: 'estado-activo',
      inactivo: 'estado-inactivo',
      bloqueado: 'estado-bloqueado'
    };
    return classes[estado] || 'estado-inactivo';
  };

  // Get rol badge class
  const getRolBadgeClass = (rol) => {
    const classes = {
      administrador: 'rol-administrador',
      operador: 'rol-operador',
      usuario: 'rol-usuario'
    };
    return classes[rol.toLowerCase()] || 'rol-usuario';
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
                  <th>Usuarios</th>
                  <th>Categorías</th>
                  <th>Estado</th>
                  <th>Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="loading-cell">Cargando dependencias...</td>
                  </tr>
                ) : dependencias.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">No hay dependencias registradas</td>
                  </tr>
                ) : (
                  dependencias.map((dependencia) => {
                    const usuariosDeDependencia = getUsuariosPorDependencia(dependencia.id);
                    return (
                      <tr key={dependencia.id}>
                        <td>
                          <div className="dependencia-nombre">
                            <FaBuilding className="dependencia-icon" />
                            {dependencia.nombre}
                          </div>
                        </td>
                        <td>{dependencia.responsable}</td>
                        <td>{dependencia.email}</td>
                        <td>{dependencia.telefono}</td>
                        <td>
                          <div className="usuarios-info">
                            <button 
                              className="usuarios-btn"
                              onClick={() => handleShowUsers(dependencia)}
                              title="Ver usuarios asignados"
                            >
                              <FaUsers />
                              <span>{usuariosDeDependencia.length}</span>
                              <FaEye className="eye-icon" />
                            </button>
                            <div className="usuarios-estados">
                              {usuariosDeDependencia.filter(u => u.estado === 'activo').length > 0 && (
                                <span className="estado-activo">
                                  {usuariosDeDependencia.filter(u => u.estado === 'activo').length} activos
                                </span>
                              )}
                              {usuariosDeDependencia.filter(u => u.estado === 'inactivo').length > 0 && (
                                <span className="estado-inactivo">
                                  {usuariosDeDependencia.filter(u => u.estado === 'inactivo').length} inactivos
                                </span>
                              )}
                              {usuariosDeDependencia.filter(u => u.estado === 'bloqueado').length > 0 && (
                                <span className="estado-bloqueado">
                                  {usuariosDeDependencia.filter(u => u.estado === 'bloqueado').length} bloqueados
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="categorias-info">
                            {dependencia.categorias?.length > 0 ? (
                              <div className="categorias-list">
                                {dependencia.categorias.slice(0, 2).map((categoria, index) => (
                                  <span key={index} className="categoria-chip">
                                    {categoria}
                                  </span>
                                ))}
                                {dependencia.categorias.length > 2 && (
                                  <span className="categoria-mas">
                                    +{dependencia.categorias.length - 2} más
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="sin-categorias">Sin categorías</span>
                            )}
                          </div>
                        </td>
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
                            className="btn btn-icon" 
                            onClick={() => handleEdit(dependencia)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn btn-icon btn-delete" 
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
                    );
                  })
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

          {/* Users Modal */}
          {showUsersModal && currentDependencia && (
            <div className="modal-overlay">
              <div className="modal modal-large">
                <div className="modal-header">
                  <div className="modal-title">
                    <h2 className="archivo-black-regular">
                      <FaUsers /> Usuarios de {currentDependencia.nombre}
                    </h2>
                    <p className="inter-regular">
                      {selectedDependenciaUsers.length} usuarios asignados
                    </p>
                  </div>
                  <button 
                    className="modal-close"
                    onClick={() => setShowUsersModal(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  {selectedDependenciaUsers.length === 0 ? (
                    <div className="empty-state">
                      <FaUserTag className="empty-icon" />
                      <h3 className="archivo-black-regular">No hay usuarios asignados</h3>
                      <p className="inter-regular">
                        Esta dependencia no tiene usuarios asignados actualmente.
                      </p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setShowUsersModal(false);
                          onNavigate('usuarios');
                        }}
                      >
                        <FaPlus /> Asignar Usuarios
                      </button>
                    </div>
                  ) : (
                    <div className="usuarios-list">
                      {selectedDependenciaUsers.map(usuario => (
                        <div key={usuario.id} className="usuario-item">
                          <div className="usuario-avatar">
                            <FaUserTag />
                          </div>
                          <div className="usuario-info">
                            <h4 className="inter-semibold">{usuario.nombre}</h4>
                            <p className="inter-regular text-secondary">{usuario.correo}</p>
                            <div className="usuario-meta">
                              <span className={`rol-badge ${getRolBadgeClass(usuario.rol)}`}>
                                {usuario.rol}
                              </span>
                              <span className={`estado-badge ${getEstadoBadgeClass(usuario.estado)}`}>
                                {usuario.estado}
                              </span>
                            </div>
                          </div>
                          <div className="usuario-actions">
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setShowUsersModal(false);
                                onNavigate('usuarios');
                              }}
                              title="Ir a Panel de Usuarios"
                            >
                              <FaEye /> Ver Detalles
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Categorías de la Dependencia */}
                  <div className="categorias-seccion">
                    <h4 className="archivo-black-regular">Categorías Asociadas</h4>
                    <div className="categorias-grid">
                      {currentDependencia.categorias?.length > 0 ? (
                        currentDependencia.categorias.map((categoria, index) => (
                          <div key={index} className="categoria-item">
                            <FaBuilding className="categoria-icon" />
                            <span className="inter-medium">{categoria}</span>
                            <span className="categoria-readonly">Solo lectura</span>
                          </div>
                        ))
                      ) : (
                        <p className="inter-regular text-muted">
                          No hay categorías configuradas para esta dependencia.
                        </p>
                      )}
                    </div>
                    <div className="categorias-note">
                      <p className="inter-regular text-muted">
                        <strong>Nota:</strong> Las categorías se gestionan desde el dashboard específico de cada dependencia y no pueden editarse desde esta vista.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowUsersModal(false)}
                  >
                    Cerrar
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setShowUsersModal(false);
                      onNavigate('usuarios');
                    }}
                  >
                    <FaUsers /> Ir a Panel de Usuarios
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DependenciasScreen;
