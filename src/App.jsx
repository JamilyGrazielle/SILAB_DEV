import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Dashboard from './pages/Dashboard/Dashboard';
import Laboratorios from './pages/Laboratorios/Laboratorios';
import Manutencoes from './pages/Manutencoes/Manutencoes';
import Layout from './components/Layout/Layout';
import Reservas from './pages/Reservas/Reservas';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Protegidas - Envolvidas pelo Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          
          <Route path="/laboratorios" element={<Laboratorios />} />
          
          
          <Route path="/manutencoes" element={<Manutencoes />} />
          
          
          <Route path="/reservas" element={<Reservas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}