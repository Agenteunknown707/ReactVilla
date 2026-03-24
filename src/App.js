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
import ConfiguracionDinamica from './components/ConfiguracionDinamica'
import MiPerfil from "./components/MiPerfil"
import BitacoraScreen from "./components/BitacoraScreen"
import AppShell from "./components/AppShell"
import { DynamicConfigProvider } from "./contexts/DynamicConfigContext"

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
    if (screen === 'logout') {
      handleLogout()
    } else {
      setCurrentScreen(screen)
    }
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "login":
        return <LoginScreen onLogin={handleLogin} />
      
      case "dashboard":
        return (
          <DashboardScreen 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )
      
      case "incidencias":
        return (
          <IncidenciasScreen 
            onIncidenciaClick={handleIncidenciaClick} 
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )
      
      case "detalle":
        return (
          <DetalleIncidenciaScreen
            incidencia={selectedIncidencia}
            onVolverClick={handleVolverClick}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )
      
      case "reportes":
        return (
          <ReporteScreen
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )
      
      case "dependencias":
        return (
          <DependenciasScreen
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )
      
      case "mapa":
        return (
          <MapaScreen
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )
      
      case "configuracion":
        return (
          <ConfiguracionDinamica
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )
      
      case "perfil":
        return (
          <MiPerfil onLogout={handleLogout} onNavigate={handleNavigate} />
        )
      
      case "bitacora":
        return (
          <BitacoraScreen onLogout={handleLogout} onNavigate={handleNavigate} />
        )
      
      default:
        return <LoginScreen onLogin={handleLogin} />
    }
  }

  return (
    <DynamicConfigProvider>
      <div className="app">
        {currentScreen === "login" ? (
          renderCurrentScreen()
        ) : (
          <AppShell 
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            {renderCurrentScreen()}
          </AppShell>
        )}
      </div>
    </DynamicConfigProvider>
  )
}

export default App
