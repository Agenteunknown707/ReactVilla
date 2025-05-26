import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Header from './Header';
import Sidebar from './Sidebar';
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
  LineElement
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
  LineElement
);

// Mock data - Replace with actual API calls
const mockData = {
  summaryCards: [
    { title: 'Incidencias Abiertas', value: '24', trend: '+12', trendPositive: false },
    { title: 'En Progreso', value: '8', trend: '-5', trendPositive: true },
    { title: 'Resueltas', value: '156', trend: '+23', trendPositive: true },
    { title: 'Tiempo Promedio', value: '2.4h', trend: '-0.5h', trendPositive: true },
  ],
  pieData: {
    labels: ['Agua', 'Alumbrado', 'Bache', 'Limpieza'],
    datasets: [
      {
        data: [30, 25, 20, 15],
        backgroundColor: [
          '#4e73df',
          '#1cc88a',
          '#36b9cc',
          '#f6c23e',
        ],
      },
    ],
  },
  barData: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Agua',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: '#4e73df',
      },
      {
        label: 'Alumbrado',
        data: [8, 15, 7, 9, 6, 10],
        backgroundColor: '#1cc88a',
      },
      {
        label: 'Bache',
        data: [5, 10, 6, 8, 12, 7],
        backgroundColor: '#36b9cc',
      },
    ],
  },
  // Additional chart data...
};

const DashboardScreen = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderSummaryTab = () => (
    <div className="dashboard-tab-content">
      <div className="dashboard-cards">
        {mockData.summaryCards.map((card, index) => (
          <div key={index} className="dashboard-card">
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <div className="card-value-container">
                <span className="card-value">{card.value}</span>
                <span className={`card-trend ${card.trendPositive ? 'positive' : 'negative'}`}>
                  {card.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Resumen de Incidencias</h3>
            <div className="chart-actions">
              <button className="chart-action-btn">📊</button>
              <button className="chart-action-btn">⬇️</button>
              <button className="chart-action-btn">🖨️</button>
            </div>
          </div>
          <div className="chart-wrapper">
            <Pie data={mockData.pieData} />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Incidencia por Tipo</h3>
            <div className="chart-actions">
              <button className="chart-action-btn">📊</button>
              <button className="chart-action-btn">⬇️</button>
              <button className="chart-action-btn">🖨️</button>
            </div>
          </div>
          <div className="chart-wrapper">
            <Bar
              data={mockData.barData}
              options={{
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="dashboard-tab-content">
      <div className="analytics-grid">
        {[
          'Incidencia por Tipo',
          'Desempeño de Dependencias',
          'Tiempo de Resolución',
          'Incidencia por Ubicación',
          'Tiempo de Respuesta Promedio',
          'Carga Actual por Dependencia',
          'Tiempo Promedio por Tipo de Incidencia',
          'Índice de Cumplimiento por Dependencia',
          'Presupuesto por Dependencia',
          'Panel de KPIs'
        ].map((title, index) => (
          <div key={index} className="analytics-card">
            <div className="chart-header">
              <h4>{title}</h4>
              <div className="chart-actions">
                <button className="chart-action-btn">📊</button>
                <button className="chart-action-btn">⬇️</button>
                <button className="chart-action-btn">🖨️</button>
              </div>
            </div>
            <div className="chart-placeholder">
              {title} - Gráfico {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Cargando datos...</div>
      </div>
    );
  }

  // Handle navigation to other screens
  const handleNavigation = (screen) => {
    onNavigate(screen);
  };

  return (
    <div className="app">
      <Header onLogout={onLogout} />
      <div className="main-content">
        <Sidebar activeItem="dashboard" onNavigate={handleNavigation} />
        <div className="content">
          <div className="dashboard-container">
            <div className="dashboard-header">
              <h1>Panel de Control</h1>
              <div className="dashboard-tabs">
                <button
                  className={`tab-btn ${activeTab === 'resumen' ? 'active' : ''}`}
                  onClick={() => setActiveTab('resumen')}
                >
                  Resumen
                </button>
                <button
                  className={`tab-btn ${activeTab === 'analiticas' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analiticas')}
                >
                  Analíticas
                </button>
              </div>
            </div>

            {activeTab === 'resumen' ? renderSummaryTab() : renderAnalyticsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
