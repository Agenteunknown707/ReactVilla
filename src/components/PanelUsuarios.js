import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaBan, FaCheck, FaLock, FaUnlock, FaSearch, FaSort, FaUsers, FaBuilding, FaEnvelope, FaUserTag, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';
import '../styles/PanelUsuarios.css';

function PanelUsuarios({ onNavigate, onLogout }) {
  const [users, setUsers] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDependency, setSelectedDependency] = useState(null);
  const [showDependencyView, setShowDependencyView] = useState(false);

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'usuario',
    dependencia_id: '',
    estado: 'activo'
  });

  // Mock data - Reemplazar con llamadas API reales
  const mockUsers = [
    { id: 1, nombre: 'Juan Pérez', correo: 'juan.perez@colima.gob.mx', rol: 'Administrador', dependencia: 'Obras Públicas', estado: 'activo', dependencia_id: 1 },
    { id: 2, nombre: 'María González', correo: 'maria.gonzalez@colima.gob.mx', rol: 'Operador', dependencia: 'Servicios Públicos', estado: 'activo', dependencia_id: 2 },
    { id: 3, nombre: 'Carlos Rodríguez', correo: 'carlos.rodriguez@colima.gob.mx', rol: 'Usuario', dependencia: 'Protección Civil', estado: 'inactivo', dependencia_id: 3 },
    { id: 4, nombre: 'Ana Martínez', correo: 'ana.martinez@colima.gob.mx', rol: 'Operador', dependencia: 'Agua Potable', estado: 'bloqueado', dependencia_id: 4 },
    { id: 5, nombre: 'Luis Sánchez', correo: 'luis.sanchez@colima.gob.mx', rol: 'Usuario', dependencia: 'Parques y Jardines', estado: 'activo', dependencia_id: 5 },
    { id: 6, nombre: 'Patricia López', correo: 'patricia.lopez@colima.gob.mx', rol: 'Administrador', dependencia: 'Obras Públicas', estado: 'activo', dependencia_id: 1 },
    { id: 7, nombre: 'Roberto Díaz', correo: 'roberto.diaz@colima.gob.mx', rol: 'Operador', dependencia: 'Servicios Públicos', estado: 'activo', dependencia_id: 2 },
    { id: 8, nombre: 'Sofía Hernández', correo: 'sofia.hernandez@colima.gob.mx', rol: 'Usuario', dependencia: 'Protección Civil', estado: 'inactivo', dependencia_id: 3 },
  ];

  const mockDependencies = [
    { id: 1, nombre: 'Obras Públicas', categorias: ['Baches', 'Señalamiento', 'Alcantarillado'] },
    { id: 2, nombre: 'Servicios Públicos', categorias: ['Limpieza', 'Alumbrado', 'Parques'] },
    { id: 3, nombre: 'Protección Civil', categorias: ['Emergencias', 'Prevención', 'Evacuación'] },
    { id: 4, nombre: 'Agua Potable', categorias: ['Fugas', 'Conexiones', 'Calidad'] },
    { id: 5, nombre: 'Parques y Jardines', categorias: ['Mantenimiento', 'Riego', 'Podas'] },
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setUsers(mockUsers);
      setDependencies(mockDependencies);
      setLoading(false);
    }, 1000);
  }, []);

  // Funciones de ordenamiento
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // Funciones de filtrado
  const filteredUsers = sortedUsers.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const usersPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Funciones de gestión de usuarios
  const handleCreateUser = () => {
    setFormData({
      nombre: '',
      correo: '',
      password: '',
      rol: 'usuario',
      dependencia_id: '',
      estado: 'activo'
    });
    setShowCreateModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      password: '',
      rol: user.rol,
      dependencia_id: user.dependencia_id,
      estado: user.estado
    });
    setShowEditModal(true);
  };

  const handleSaveUser = async (isEdit = false) => {
    // Validaciones
    if (!formData.nombre || !formData.correo || (!isEdit && !formData.password) || !formData.dependencia_id) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (!formData.correo.includes('@')) {
      alert('Por favor ingrese un correo válido');
      return;
    }

    if (!isEdit && formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      // Simular llamada API
      console.log('Guardando usuario:', formData);
      
      // Actualizar lista de usuarios
      if (isEdit) {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
      } else {
        const newUser = { ...formData, id: users.length + 1 };
        setUsers([...users, newUser]);
      }

      // Cerrar modal y limpiar formulario
      setShowCreateModal(false);
      setShowEditModal(false);
      setFormData({
        nombre: '',
        correo: '',
        password: '',
        rol: 'usuario',
        dependencia_id: '',
        estado: 'activo'
      });
      setSelectedUser(null);

      alert(`Usuario ${isEdit ? 'actualizado' : 'creado'} exitosamente`);
    } catch (error) {
      alert('Error al guardar usuario');
    }
  };

  const handleToggleUserState = (userId, currentState) => {
    const confirmMessage = currentState === 'activo' 
      ? '¿Está seguro de desactivar este usuario?' 
      : '¿Está seguro de activar este usuario?';
    
    if (window.confirm(confirmMessage)) {
      const newState = currentState === 'activo' ? 'inactivo' : 'activo';
      setUsers(users.map(u => u.id === userId ? { ...u, estado: newState } : u));
      alert(`Usuario ${newState === 'activo' ? 'activado' : 'desactivado'} exitosamente`);
    }
  };

  const handleBlockUser = (userId) => {
    if (window.confirm('¿Está seguro de bloquear este usuario?')) {
      setUsers(users.map(u => u.id === userId ? { ...u, estado: 'bloqueado' } : u));
      alert('Usuario bloqueado exitosamente');
    }
  };

  const handleViewDependency = (dependency) => {
    setSelectedDependency(dependency);
    setShowDependencyView(true);
  };

  const getEstadoBadge = (estado) => {
    const classes = {
      activo: 'estado-activo',
      inactivo: 'estado-inactivo',
      bloqueado: 'estado-bloqueado'
    };
    return classes[estado] || 'estado-inactivo';
  };

  const getEstadoIcon = (estado) => {
    const icons = {
      activo: <FaCheck />,
      inactivo: <FaToggleOff />,
      bloqueado: <FaLock />
    };
    return icons[estado] || <FaToggleOff />;
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  if (showDependencyView && selectedDependency) {
    return (
      <div className="main-content">
        <div className="dependency-view-header">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowDependencyView(false)}
          >
            ← Volver a Usuarios
          </button>
          <div className="dependency-info">
            <h2 className="archivo-black-regular">{selectedDependency.nombre}</h2>
            <p className="inter-regular">Gestión de usuarios y categorías</p>
          </div>
        </div>

        <div className="dependency-content">
          <div className="dependency-section">
            <div className="card">
              <div className="card-header">
                <h3 className="archivo-black-regular">Usuarios Asignados</h3>
                <span className="user-count">
                  <FaUsers /> {users.filter(u => u.dependencia_id === selectedDependency.id).length} usuarios
                </span>
              </div>
              <div className="users-list">
                {users
                  .filter(u => u.dependencia_id === selectedDependency.id)
                  .map(user => (
                    <div key={user.id} className="user-item">
                      <div className="user-avatar">
                        <FaUserTag />
                      </div>
                      <div className="user-info">
                        <h4 className="inter-semibold">{user.nombre}</h4>
                        <p className="inter-regular text-secondary">{user.correo}</p>
                        <span className={`role-badge ${user.rol.toLowerCase()}`}>
                          {user.rol}
                        </span>
                      </div>
                      <div className="user-status">
                        <span className={`estado-badge ${getEstadoBadge(user.estado)}`}>
                          {getEstadoIcon(user.estado)} {user.estado}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="dependency-section">
            <div className="card">
              <div className="card-header">
                <h3 className="archivo-black-regular">Categorías Asociadas</h3>
                <span className="category-count">
                  {selectedDependency.categorias.length} categorías
                </span>
              </div>
              <div className="categories-list">
                {selectedDependency.categorias.map((categoria, index) => (
                  <div key={index} className="category-item">
                    <FaBuilding className="category-icon" />
                    <span className="inter-medium">{categoria}</span>
                    <span className="category-readonly">Solo lectura</span>
                  </div>
                ))}
              </div>
              <div className="categories-note">
                <p className="inter-regular text-muted">
                  <strong>Nota:</strong> Las categorías se gestionan desde el dashboard específico de cada dependencia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="panel-usuarios-header">
        <div className="header-content">
          <h1 className="archivo-black-regular">Panel de Usuarios</h1>
          <p className="inter-regular">Gestión de usuarios y asignación a dependencias</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={handleCreateUser}
          >
            <FaPlus /> Crear Usuario
          </button>
        </div>
      </div>

      <div className="panel-usuarios-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="dependencies-quick-access">
          <span className="inter-medium">Dependencias:</span>
          {dependencies.map(dep => (
            <button
              key={dep.id}
              className="dependency-chip"
              onClick={() => handleViewDependency(dep)}
            >
              <FaBuilding /> {dep.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="archivo-black-regular">Usuarios Registrados</h3>
          <span className="user-count">
            {filteredUsers.length} usuarios encontrados
          </span>
        </div>

        {paginatedUsers.length === 0 ? (
          <div className="empty-state">
            <FaUsers className="empty-icon" />
            <h3 className="archivo-black-regular">No se encontraron usuarios</h3>
            <p className="inter-regular">
              {searchTerm ? 'Intenta con otra búsqueda' : 'Comienza creando el primer usuario'}
            </p>
            {!searchTerm && (
              <button 
                className="btn btn-primary"
                onClick={handleCreateUser}
              >
                <FaPlus /> Crear Primer Usuario
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <button 
                      className="sort-button"
                      onClick={() => handleSort('nombre')}
                    >
                      Nombre <FaSort />
                    </button>
                  </th>
                  <th>
                    <button 
                      className="sort-button"
                      onClick={() => handleSort('correo')}
                    >
                      Correo <FaSort />
                    </button>
                  </th>
                  <th>
                    <button 
                      className="sort-button"
                      onClick={() => handleSort('rol')}
                    >
                      Rol <FaSort />
                    </button>
                  </th>
                  <th>
                    <button 
                      className="sort-button"
                      onClick={() => handleSort('dependencia')}
                    >
                      Dependencia <FaSort />
                    </button>
                  </th>
                  <th>
                    <button 
                      className="sort-button"
                      onClick={() => handleSort('estado')}
                    >
                      Estado <FaSort />
                    </button>
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id}>
                    <td className="inter-medium">{user.nombre}</td>
                    <td className="inter-regular">
                      <FaEnvelope className="email-icon" />
                      {user.correo}
                    </td>
                    <td>
                      <span className={`role-badge ${user.rol.toLowerCase()}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td className="inter-regular">{user.dependencia}</td>
                    <td>
                      <span className={`estado-badge ${getEstadoBadge(user.estado)}`}>
                        {getEstadoIcon(user.estado)} {user.estado}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEditUser(user)}
                          title="Editar usuario"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleToggleUserState(user.id, user.estado)}
                          title={user.estado === 'activo' ? 'Desactivar' : 'Activar'}
                        >
                          {user.estado === 'activo' ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleBlockUser(user.id)}
                          title="Bloquear usuario"
                          disabled={user.estado === 'bloqueado'}
                        >
                          <FaBan />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-button"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="pagination-info">
              Página {currentPage} de {totalPages}
            </span>
            <button 
              className="pagination-button"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal Crear Usuario */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="archivo-black-regular">Crear Nuevo Usuario</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label inter-semibold">Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ingrese el nombre completo"
                />
              </div>
              <div className="form-group">
                <label className="form-label inter-semibold">Correo *</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label inter-semibold">Contraseña *</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="form-group">
                <label className="form-label inter-semibold">Rol *</label>
                <select
                  className="form-control"
                  value={formData.rol}
                  onChange={(e) => setFormData({...formData, rol: e.target.value})}
                >
                  <option value="usuario">Usuario</option>
                  <option value="operador">Operador</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label inter-semibold">Dependencia *</label>
                <select
                  className="form-control"
                  value={formData.dependencia_id}
                  onChange={(e) => setFormData({...formData, dependencia_id: e.target.value})}
                >
                  <option value="">Seleccione una dependencia</option>
                  {dependencies.map(dep => (
                    <option key={dep.id} value={dep.id}>
                      {dep.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleSaveUser(false)}
              >
                <FaPlus /> Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="archivo-black-regular">Editar Usuario</h3>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label inter-semibold">Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ingrese el nombre completo"
                />
              </div>
              <div className="form-group">
                <label className="form-label inter-semibold">Correo *</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label inter-semibold">Contraseña (dejar en blanco para mantener actual)</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Nueva contraseña (opcional)"
                />
              </div>
              <div className="form-group">
                <label className="form-label inter-semibold">Rol *</label>
                <select
                  className="form-control"
                  value={formData.rol}
                  onChange={(e) => setFormData({...formData, rol: e.target.value})}
                >
                  <option value="usuario">Usuario</option>
                  <option value="operador">Operador</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label inter-semibold">Dependencia *</label>
                <select
                  className="form-control"
                  value={formData.dependencia_id}
                  onChange={(e) => setFormData({...formData, dependencia_id: e.target.value})}
                >
                  <option value="">Seleccione una dependencia</option>
                  {dependencies.map(dep => (
                    <option key={dep.id} value={dep.id}>
                      {dep.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleSaveUser(true)}
              >
                <FaEdit /> Actualizar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelUsuarios;
