"use client"
import { useState } from "react"
import { API_ENDPOINTS } from "../config/api"

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DEPENDENCIAS}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, password }),
      });

      if (!response.ok) throw new Error('Credenciales inválidas');

      const { token, usuario } = await response.json();
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(usuario));
      onLogin();
    } catch (error) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.')
    }
  }

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
          {error && <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
          
          <div className="form-group">
            <label>Correo electrónico</label>
            <input 
              type="email" 
              placeholder="admin@example.com" 
              className="input-yellow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="input-yellow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-iniciar" onClick={handleLogin}>
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
