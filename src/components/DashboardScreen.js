import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { API_ENDPOINTS } from '../config/api';
import { useDynamicConfig } from '../contexts/DynamicConfigContext';
import '../styles/DashboardScreen.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

// Mock data - Replace with actual API calls
const mockAnalyticsData = {
  // KPIs principales
  kpis: [
    { 
      title: 'Tasa de Resolución', 
      value: '78.5%', 
      trend: '+5.2%', 
      trendPositive: true,
      description: 'Últimos 30 días'
    },
    { 
      title: 'Tiempo Promedio', 
      value: '3.2 días', 
      trend: '-0.8 días', 
      trendPositive: true,
      description: 'Promedio de resolución'
    },
    { 
      title: 'Backlog Actual', 
      value: '147', 
      trend: '+12', 
      trendPositive: false,
      description: 'Incidencias pendientes'
    },
    { 
      title: 'Tasa de Rechazo', 
      value: '12.3%', 
      trend: '-2.1%', 
      trendPositive: true,
      description: 'Rechazadas / Totales'
    }
  ],

  // 1. Flujo de incidencias (Embudo)
  funnelData: {
    labels: ['Reportadas', 'Validadas', 'En Proceso', 'Resueltas', 'Rechazadas'],
    datasets: [{
      label: 'Incidencias',
      data: [450, 380, 320, 280, 55],
      backgroundColor: [
        'rgba(0, 45, 114, 0.8)',
        'rgba(0, 68, 163, 0.8)',
        'rgba(0, 86, 179, 0.8)',
        'rgba(34, 139, 34, 0.8)',
        'rgba(220, 53, 69, 0.8)'
      ],
      borderColor: [
        'rgba(0, 45, 114, 1)',
        'rgba(0, 68, 163, 1)',
        'rgba(0, 86, 179, 1)',
        'rgba(34, 139, 34, 1)',
        'rgba(220, 53, 69, 1)'
      ],
      borderWidth: 2
    }]
  },

  // 2. Tiempo promedio por etapa
  timeByStageData: {
    labels: ['Pendiente', 'Validación', 'En Proceso', 'Resolución', 'Cierre'],
    datasets: [{
      label: 'Tiempo Promedio (días)',
      data: [1.2, 0.8, 4.5, 2.1, 0.3],
      backgroundColor: 'rgba(0, 45, 114, 0.8)',
      borderColor: 'rgba(0, 45, 114, 1)',
      borderWidth: 2
    }]
  },

  // 3. Backlog en el tiempo
  backlogTimeData: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Backlog Acumulado',
        data: [120, 135, 142, 128, 145, 160, 155, 148, 162, 170, 165, 147],
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Incidencias Nuevas',
        data: [45, 52, 38, 42, 48, 55, 43, 38, 52, 47, 44, 41],
        borderColor: 'rgba(0, 45, 114, 1)',
        backgroundColor: 'rgba(0, 45, 114, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  },

  // 4. Motivos de rechazo
  rejectionReasonsData: {
    labels: ['Información Incompleta', 'Fuera de Jurisdicción', 'Duplicado', 'Inválido', 'Otro'],
    datasets: [{
      data: [35, 28, 20, 12, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 2
    }]
  },

  // 5. Tasa de rechazo tendencia
  rejectionRateData: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{
      label: 'Tasa de Rechazo (%)',
      data: [18.5, 16.2, 15.8, 14.3, 13.7, 12.9, 13.2, 12.8, 11.5, 12.1, 11.8, 12.3],
      borderColor: 'rgba(220, 53, 69, 1)',
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
      fill: true,
      tension: 0.4
    }]
  },

  // 6. Eficiencia por dependencia
  dependencyEfficiencyData: {
    labels: ['Obras Públicas', 'Servicios Públicos', 'Protección Civil', 'Agua Potable', 'Parques y Jardines'],
    datasets: [
      {
        label: 'Incidencias Resueltas',
        data: [85, 92, 78, 88, 73],
        backgroundColor: 'rgba(34, 139, 34, 0.8)',
        borderColor: 'rgba(34, 139, 34, 1)',
        borderWidth: 2
      },
      {
        label: 'Tiempo Promedio (días)',
        data: [2.8, 3.5, 4.2, 2.1, 5.1],
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2
      },
      {
        label: 'Cumplimiento SLA (%)',
        data: [92, 88, 85, 94, 78],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }
    ]
  }
};

function DashboardScreen({ onNavigate, onLogout }) {
  const { config } = useDynamicConfig();
  const [data, setData] = useState(mockAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d
  const [selectedDependency, setSelectedDependency] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const horizontalBarOptions = {
    ...chartOptions,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Cargando analíticas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="dashboard-controls">
        <select 
          className="form-control"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
        </select>
        
        <select 
          className="form-control"
          value={selectedDependency}
          onChange={(e) => setSelectedDependency(e.target.value)}
        >
          <option value="all">Todas las dependencias</option>
          <option value="obras">Obras Públicas</option>
          <option value="servicios">Servicios Públicos</option>
          <option value="proteccion">Protección Civil</option>
          <option value="agua">Agua Potable</option>
        </select>
      </div>

      {/* KPIs Principales */}
      <div className="kpi-grid">
        {data.kpis.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <h3 className="kpi-title">{kpi.title}</h3>
              <span className={`kpi-trend ${kpi.trendPositive ? 'positive' : 'negative'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-description">{kpi.description}</div>
          </div>
        ))}
      </div>

      {/* Primera fila de gráficas */}
      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Flujo de Incidencias</h3>
            <p>Embudo de conversión por etapa</p>
          </div>
          <div className="chart-wrapper">
            <Bar data={data.funnelData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Tiempo Promedio por Etapa</h3>
            <p>Identificación de cuellos de botella</p>
          </div>
          <div className="chart-wrapper">
            <Bar data={data.timeByStageData} options={horizontalBarOptions} />
          </div>
        </div>
      </div>

      {/* Segunda fila de gráficas */}
      <div className="charts-row">
        <div className="chart-container wide">
          <div className="chart-header">
            <h3>Backlog Acumulado en el Tiempo</h3>
            <p>Evolución de incidencias pendientes y nuevas</p>
          </div>
          <div className="chart-wrapper">
            <Line data={data.backlogTimeData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Tercera fila de gráficas */}
      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Motivos de Rechazo</h3>
            <p>Análisis de calidad de reportes</p>
          </div>
          <div className="chart-wrapper">
            <Doughnut data={data.rejectionReasonsData} options={pieOptions} />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Tasa de Rechazo - Tendencia</h3>
            <p>Evolución mensual de rechazos</p>
          </div>
          <div className="chart-wrapper">
            <Line data={data.rejectionRateData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Cuarta fila - Eficiencia por dependencia */}
      <div className="chart-container full-width">
        <div className="chart-header">
          <h3>Eficiencia por Dependencia</h3>
          <p>Comparativo de desempeño institucional</p>
        </div>
        <div className="chart-wrapper">
          <Bar data={data.dependencyEfficiencyData} options={chartOptions} />
        </div>
      </div>

      {/* Insights y Recomendaciones */}
      <div className="insights-section">
        <div className="card">
          <div className="card-header">
            <h3>Insights y Recomendaciones</h3>
          </div>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-icon">⚠️</div>
              <div className="insight-content">
                <h4>Cuello de Botella Detectado</h4>
                <p>La etapa "En Proceso" presenta el mayor tiempo promedio (4.5 días). Considerar redistribuir recursos.</p>
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon">📈</div>
              <div className="insight-content">
                <h4>Tendencia Positiva</h4>
                <p>La tasa de rechazo ha disminuido 2.1 puntos porcentuales en el último mes.</p>
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h4>Oportunidad de Mejora</h4>
                <p>35% de rechazos son por "Información Incompleta". Implementar validación automática.</p>
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon">🏆</div>
              <div className="insight-content">
                <h4>Mejor Desempeño</h4>
                <p>Agua Potable tiene el mejor cumplimiento de SLA (94%) y menor tiempo de resolución.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;
