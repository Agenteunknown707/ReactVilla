import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Configuración inicial del sistema
const initialConfig = {
  // Colores del sistema
  primaryColor: '#002D72',
  secondaryColor: '#0044a3',
  
  // Información del sistema
  systemName: 'Sistema Municipal',
  systemSlogan: 'Gestión Inteligente',
  municipality: 'colima',
  
  // Assets
  logo: null,
  loginBackground: 'https://estacionpacifico.com/wp-content/uploads/2022/07/27-Julio-Colima-2.png',
  
  // Configuración adicional
  theme: 'light',
  compactMode: false
}

// Municipios disponibles
const municipalities = [
  { value: "colima", label: "Colima" },
  { value: "villa_de_alvarez", label: "Villa de Álvarez" },
  { value: "manzanillo", label: "Manzanillo" },
  { value: "tecoman", label: "Tecomán" },
  { value: "armeria", label: "Armería" },
  { value: "coquimatlan", label: "Coquimatlán" },
  { value: "cuauhtemoc", label: "Cuauhtémoc" },
  { value: "ixtlahuacan", label: "Ixtlahuacán" },
  { value: "minatitlan", label: "Minatitlán" },
  { value: "comala", label: "Comala" }
]

// Crear el contexto
const DynamicConfigContext = createContext()

// Hook para usar el contexto
export const useDynamicConfig = () => {
  const context = useContext(DynamicConfigContext)
  if (!context) {
    throw new Error('useDynamicConfig debe ser usado dentro de un DynamicConfigProvider')
  }
  return context
}

// Provider del contexto
export const DynamicConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(initialConfig)
  const [isLoading, setIsLoading] = useState(true)

  // Función para aplicar variables CSS
  const applyCSSVariables = useCallback((config) => {
    try {
      const root = document.documentElement
      
      // Variables de color
      root.style.setProperty('--dynamic-primary-color', config.primaryColor)
      root.style.setProperty('--dynamic-secondary-color', config.secondaryColor)
      root.style.setProperty('--dynamic-primary-hover', adjustColor(config.primaryColor, -10))
      root.style.setProperty('--dynamic-primary-light', adjustColor(config.primaryColor, 80))
      
      // Variables de imagen
      if (config.logo) {
        root.style.setProperty('--dynamic-logo', `url(${config.logo})`)
      }
      
      // Variables de texto
      root.style.setProperty('--dynamic-system-name', `"${config.systemName}"`)
      root.style.setProperty('--dynamic-system-slogan', `"${config.systemSlogan}"`)
    } catch (error) {
      console.error('Error al aplicar variables CSS:', error)
    }
  }, [])

  // Función para limpiar localStorage si está lleno
  const cleanLocalStorage = useCallback(() => {
    try {
      // Obtener todas las claves de localStorage
      const keys = Object.keys(localStorage)
      let totalSize = 0
      
      // Calcular tamaño total
      keys.forEach(key => {
        const value = localStorage.getItem(key)
        if (value) {
          totalSize += key.length + value.length
        }
      })
      
      // Si el tamaño es mayor a 4MB, limpiar items antiguos
      if (totalSize > 4 * 1024 * 1024) {
        console.log('Limpiando localStorage para evitar quota exceeded')
        // Mantener solo configuración esencial
        const essentialKeys = ['dynamicConfig', 'darkMode', 'authToken']
        keys.forEach(key => {
          if (!essentialKeys.includes(key)) {
            localStorage.removeItem(key)
          }
        })
      }
    } catch (error) {
      console.error('Error al limpiar localStorage:', error)
    }
  }, [])

  // Función segura para guardar en localStorage
  const safeLocalStorageSet = useCallback((key, value) => {
    try {
      cleanLocalStorage()
      localStorage.setItem(key, value)
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Quota exceeded, limpiando localStorage completamente')
        // Limpiar todo excepto items críticos
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key !== 'authToken') {
            localStorage.removeItem(key)
          }
        })
        // Intentar guardar solo lo esencial
        try {
          localStorage.setItem(key, value)
        } catch (secondError) {
          console.error('No se pudo guardar ni después de limpiar:', secondError)
        }
      }
    }
  }, [cleanLocalStorage])

  // Cargar configuración desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('dynamicConfig')
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig({ ...initialConfig, ...parsedConfig })
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error)
      // Limpiar localStorage si hay corrupción
      localStorage.removeItem('dynamicConfig')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Guardar configuración en localStorage cuando cambia (con debounce)
  useEffect(() => {
    if (!isLoading) {
      // Usar un timeout para evitar demasiadas escrituras
      const timeoutId = setTimeout(() => {
        try {
          safeLocalStorageSet('dynamicConfig', JSON.stringify(config))
          // Aplicar variables CSS dinámicamente
          applyCSSVariables(config)
        } catch (error) {
          console.error('Error al guardar configuración:', error)
        }
      }, 300) // 300ms debounce

      return () => clearTimeout(timeoutId)
    }
  }, [config, isLoading, safeLocalStorageSet, applyCSSVariables])

  // Función para ajustar el brillo de un color
  const adjustColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1)
  }

  // Funciones para actualizar la configuración
  const updateConfig = (newConfig) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }))
  }

  const updatePrimaryColor = (color) => {
    updateConfig({ 
      primaryColor: color,
      secondaryColor: adjustColor(color, 20)
    })
  }

  const updateSystemName = (name) => {
    updateConfig({ systemName: name })
  }

  const updateSystemSlogan = (slogan) => {
    updateConfig({ systemSlogan: slogan })
  }

  const updateMunicipality = (municipality) => {
    updateConfig({ municipality })
  }

  const updateLogo = (logoUrl) => {
    updateConfig({ logo: logoUrl })
  }

  const updateLoginBackground = (backgroundUrl) => {
    updateConfig({ loginBackground: backgroundUrl })
  }

  const resetConfig = () => {
    setConfig(initialConfig)
    localStorage.removeItem('dynamicConfig')
  }

  // Obtener información del municipio actual
  const getCurrentMunicipality = () => {
    return municipalities.find(m => m.value === config.municipality) || municipalities[0]
  }

  const value = {
    config,
    isLoading,
    municipalities,
    updateConfig,
    updatePrimaryColor,
    updateSystemName,
    updateSystemSlogan,
    updateMunicipality,
    updateLogo,
    updateLoginBackground,
    resetConfig,
    getCurrentMunicipality
  }

  return (
    <DynamicConfigContext.Provider value={value}>
      {children}
    </DynamicConfigContext.Provider>
  )
}

export default DynamicConfigContext
