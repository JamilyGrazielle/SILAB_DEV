// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('silab_token');
    // CORREÇÃO: Usando a chave exata que foi definida no Login.jsx
    const userRole = localStorage.getItem('silab_perfil'); 

    if (!token) {
      navigate('/');
    } else {
      if (userRole) {
        setPerfil(userRole);
      }
    }
  }, [navigate]);

  return (
    <div className="dash-container">
      <div className="dash-title-section">
        <h2>Painel de Controle</h2>
        <p>Bem-vindo ao Sistema Integrado de Laboratórios do IFMA.</p>
      </div>

      {/* NOVO: Adicionado um wrapper para o grid para facilitar o alinhamento centralizado */}
      <div className="dash-grid-wrapper">
        <div className="dash-grid">
          
          {/* Card visível para todos (Professores, Admins e Root) */}
          <div className="dash-card" style={{border: '1px solid hsl(142, 76%, 70%)'}}>
            <div className="card-icon reserv">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            {perfil === 'PROFESSOR' ? (
              <>
                <h3>Minhas Reservas</h3>
                <p>Visualize a agenda, crie novas reservas e gerencie seus agendamentos de laboratório.</p>
              </>
            ) : (
              <>
                <h3>Gestão de Reservas</h3>
                <p>Visualize e gerencie todas as reservas dos laboratórios.</p>
              </>
            )}
            <button className="card-btn green" onClick={() => navigate('/reservas')}>Ver Reservas</button>
          </div>

          {/* Só mostra para ADMIN ou ROOT */}
          {(perfil === 'ADMIN' || perfil === 'ROOT') && (
            <>
              <div className="dash-card" style={{border: '1px solid hsl(243, 75%, 70%)'}}>
                <div className="card-icon labs">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3>Laboratórios</h3>
                <p>Gerencie informações, equipamentos, capacidade e status de manutenção das salas.</p>
                <button className="card-btn blue" onClick={() => navigate('/laboratorios')}>Gerenciar</button>
              </div>

              <div className="dash-card" style={{border: '1px solid hsl(32, 75%, 70%)'}}>
                <div className="card-icon users">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3>Usuários e Solicitações</h3>
                <p>Aprove ou rejeite cadastros pendentes e altere permissões de acesso do sistema.</p>
                <button className="card-btn orange" onClick={() => navigate('/usuarios')}>Analisar</button>
              </div>

              <div className="dash-card" style={{border: '1px solid hsl(44, 100%, 70%)'}}>
                <div className="card-icon manutencao">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                <h3>Manutenções</h3>
                <p>Bloqueie laboratórios para reparos e visualize o histórico de interdições.</p>
                <button className="card-btn yellow" onClick={() => navigate('/manutencoes')}>Auditar</button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}