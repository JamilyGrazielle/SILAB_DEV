// src/components/Layout/Layout.jsx

import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import logoSilab from '../../assets/logo-silab.svg';
import './Layout.css';

export default function Layout() {
  const navigate = useNavigate();
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('silab_token');
    if (!token) {
      navigate('/');
    } else {
      setAutenticado(true);
    }
  }, [navigate]);

  
  // Resgata os dados do usuário logado
  const userName = localStorage.getItem('silab_user') || 'Usuário';
  // A chave de perfil 'silab_perfil' é usada na Dashboard para lógica de cards,
  // aqui no layout usamos apenas o nome para exibição.
  
  // Pega a primeira letra do nome para o Avatar Verde
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('silab_token');
    localStorage.removeItem('silab_user');
    localStorage.removeItem('silab_perfil');
    navigate('/');
  };

  if (!autenticado) return null;

  return (
    <div className="layout-wrapper">
      {/* TOPO FIXO NO TOPO (HEADER) */}
      <header className="layout-header">
        <div className="layout-logo">
          <img src={logoSilab} alt="Logo SILAB" />
        </div>
        
        <div className="layout-user-menu">
          <div className="user-avatar">{userInitial}</div>
          <span className="user-name">Olá, <strong>{userName}</strong></span>
          <button onClick={handleLogout} className="btn-logout-precision">Sair</button>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO DINÂMICO (ONDE O DASHBOARD VAI APARECER) */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* RODAPÉ NO FINAL DA PÁGINA (FOOTER) */}
      <footer className="layout-footer">
        <p>Instituto Federal Educação, Ciência e Tecnologia do Maranhão &mdash; IFMA &copy; 2026</p>
        <p className="footer-sub">Sistema Integrado de Laboratórios</p>
      </footer>
    </div>
  );
}