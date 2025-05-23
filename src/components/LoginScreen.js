"use client"

function LoginScreen({ onLogin }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img
            src="https://tse4.mm.bing.net/th?id=OIP.DpSNbcx-nOUYQmPLAjmNegHaCy&pid=Api&P=0&h=180"
            alt="Logo La Villa es"
            className="logo"
          />
        </div>
        <h1 className="sistema-title">Sistema de Gestión de Incidencias</h1>
        <h2 className="ayuntamiento-title">H. AYUNTAMIENTO DE VILLA DE ÁLVAREZ</h2>
        <p className="slogan">HONESTA, TRANSPARENTE Y CERCANA</p>

        <div className="login-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" placeholder="admin@example.com" className="input-yellow" />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="••••••••" className="input-yellow" />
          </div>

          <button className="btn-iniciar" onClick={onLogin}>
            Iniciar sesión
          </button>
        </div>

        
      </div>
    </div>
  )
}

export default LoginScreen
