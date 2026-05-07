import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Dashboard from './pages/Dashboard/Dashboard';
import Laboratorios from './pages/Laboratorios/Laboratorios';
import Manutencoes from './pages/Manutencoes/Manutencoes';
import Layout from './components/Layout/Layout'; // Importamos o nosso novo Layout

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Privadas (Envolvidas pelo Layout) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* AQUI ESTÁ A CORREÇÃO: Adicionamos a rota dos Laboratórios */}
          <Route path="/laboratorios" element={<Laboratorios />} />
          
          {/* Já deixei a rota de manutenções preparada para o futuro */}
          <Route path="/manutencoes" element={<Manutencoes />} />
          
          {/* Futuras telas entrarão aqui dentro também! */}
          {/* <Route path="/reservas" element={<Reservas />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}