import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // <-- Importando o decodificador
import logoSilab from '../../assets/logo-silab.svg';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [perfil, setPerfil] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('silab_token');
    const user = localStorage.getItem('silab_user');

    if (!token) {
      navigate('/');
    } else {
      setNomeUsuario(user);
      
      // Decodificando o token para pegar as permissões
      try {
        const decoded = jwtDecode(token);
        
        // Agora o backend manda a permissão dentro de "role"
        if (decoded.role) {
          setPerfil(decoded.role); 
        }
      } catch (error) {
        console.error("Token inválido", error);
        handleLogout();
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('silab_token');
    localStorage.removeItem('silab_user');
    navigate('/');
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dash-header">
        <div className="dash-logo">
          <img src={logoSilab} alt="Logo SiLAB" />
        </div>
        <div className="dash-user-menu">
          <div className="user-avatar">
            {nomeUsuario ? nomeUsuario.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="user-name">Olá, <strong>{nomeUsuario}</strong></span>
          <button onClick={handleLogout} className="btn-logout-modern">Sair</button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-welcome">
          <h1>Painel de Controle</h1>
          <p>Bem-vindo ao Sistema Integrado de Laboratórios do IFMA.</p>
        </div>

        <div className="dash-grid">
          
          {/* Card visível para todos (Professores, Admins e Root) */}
          <div className="dash-card">
            <div className="card-icon reserv">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3>Minhas Reservas</h3>
            <p>Visualize a agenda, crie novas reservas e gerencie seus agendamentos de laboratório.</p>
            <button className="card-btn">Acessar Agenda</button>
          </div>

          {/* Só mostra para ADMIN ou ROOT (Professor não vê) */}
          {(perfil === 'ROLE_ADMIN' || perfil === 'ROLE_ROOT') && (
            <>
              <div className="dash-card">
                <div className="card-icon labs">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3>Laboratórios</h3>
                <p>Gerencie informações, equipamentos, capacidade e status de manutenção das salas.</p>
                <button className="card-btn" onClick={() => navigate('/laboratorios')}>Gerenciar</button>
              </div>

              <div className="dash-card">
                <div className="card-icon users">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3>Usuários e Solicitações</h3>
                <p>Aprove ou rejeite cadastros pendentes e altere permissões de acesso do sistema.</p>
                <button className="card-btn" onClick={() => navigate('/usuarios')}>Analisar</button>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}