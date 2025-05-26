"use client"

import { useState } from "react"
import "./App.css"
import LoginScreen from "./components/LoginScreen"
import IncidenciasScreen from "./components/IncidenciasScreen"
import DetalleIncidenciaScreen from "./components/DetalleIncidenciaScreen"
import DashboardScreen from "./components/DashboardScreen"
import ReporteScreen from "./components/ReporteScreen"
import DependenciasScreen from "./components/DependenciasScreen"
import MapaScreen from "./components/MapaScreen"
import Configuracion from "./components/Configuracion"

function App() {
  const [currentScreen, setCurrentScreen] = useState("login")
  const [selectedIncidencia, setSelectedIncidencia] = useState(null)

  const handleLogin = () => {
    setCurrentScreen("dashboard")
  }

  const handleLogout = () => {
    setCurrentScreen("login")
  }

  const handleIncidenciaClick = (incidencia) => {
    setSelectedIncidencia(incidencia)
    setCurrentScreen("detalle")
  }

  const handleVolverClick = () => {
    setCurrentScreen("incidencias")
  }

  const handleNavigate = (screen) => {
    setCurrentScreen(screen)
  }

  return (
    <div className="app">
      {currentScreen === "login" && <LoginScreen onLogin={handleLogin} />}
      {currentScreen === "dashboard" && (
        <DashboardScreen 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === "incidencias" && (
        <IncidenciasScreen 
          onIncidenciaClick={handleIncidenciaClick} 
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {currentScreen === "detalle" && (
        <DetalleIncidenciaScreen
          incidencia={selectedIncidencia}
          onVolverClick={handleVolverClick}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {currentScreen === "reportes" && (
        <ReporteScreen
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {currentScreen === "dependencias" && (
        <DependenciasScreen
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {currentScreen === "mapa" && (
        <MapaScreen
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {currentScreen === "configuracion" && (
        <Configuracion onLogout={handleLogout} onNavigate={handleNavigate} />
      )}
    </div>
  )
}

export default App
