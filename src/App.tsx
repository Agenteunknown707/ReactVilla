import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';

// Componente temporal para el Dashboard
const Dashboard: React.FC = () => (
    <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Esta es una página protegida</p>
    </div>
);

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}; 