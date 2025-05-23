"use client"

import { useState } from "react"
import "./App.css"
import LoginScreen from "./components/LoginScreen"
import IncidenciasScreen from "./components/IncidenciasScreen"
import DetalleIncidenciaScreen from "./components/DetalleIncidenciaScreen"

function App() {
  const [currentScreen, setCurrentScreen] = useState("login")
  const [selectedIncidencia, setSelectedIncidencia] = useState(null)

  const handleLogin = () => {
    setCurrentScreen("incidencias")
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

  return (
    <div className="app">
      {currentScreen === "login" && <LoginScreen onLogin={handleLogin} />}
      {currentScreen === "incidencias" && (
        <IncidenciasScreen onIncidenciaClick={handleIncidenciaClick} onLogout={handleLogout} />
      )}
      {currentScreen === "detalle" && (
        <DetalleIncidenciaScreen
          incidencia={selectedIncidencia}
          onVolverClick={handleVolverClick}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App
