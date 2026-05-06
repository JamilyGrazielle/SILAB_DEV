import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logoSilab from '../../assets/logo-silab copy.svg';

export default function Login() {
  const navigate = useNavigate();
  
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(''); 
    setLoading(true); 

    try {
      const response = await api.post('/login', {
        matricula: matricula,
        senha: senha
      });

      localStorage.setItem('silab_token', response.data.token);
      localStorage.setItem('silab_user', response.data.nome);

      //Guardando o perfil do usuário
      localStorage.setItem('silab_perfil', response.data.perfil);

      // Redireciona o usuário para o dashboard após o sucesso
      navigate('/dashboard');

    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErro('Matrícula ou senha incorretas.');
        } else if (error.response.status === 403) {
          setErro('Sua conta está inativa. Procure a administração.');
        } else {
          setErro('Erro ao processar o login. Verifique seus dados.');
        }
      } else {
        setErro('Não foi possível conectar ao servidor. O backend está rodando?');
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="bg-layer"></div>

      <div className="card">
        <div className="logo-area">
          <div className="logo-box">
            <img src={logoSilab} alt="Logo SILAB" style={{ width: '100%', height: '100%' }} />
          </div>
          <span className="sys-subtitle">Sistema Integrado de Laboratórios</span>
        </div>

        <form onSubmit={handleLogin}>
          {erro && <div className="error-message">{erro}</div>}

          <div className="field-group">
            <label className="field-label">Usuário / Matrícula</label>
            <div className="field-wrap">
              <svg className="field-icon" width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="8.5" cy="6" r="3" stroke="white" strokeWidth="1.6" />
                <path d="M2 15c0-3.5 3-5.5 6.5-5.5S15 11.5 15 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input 
                className="glass-input" 
                type="text" 
                placeholder="Digite seu usuário ou matrícula" 
                autoComplete="username"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div className="field-group">
            <label className="field-label">Senha</label>
            <div className="field-wrap">
              <svg className="field-icon" width="17" height="17" viewBox="0 0 17 17" fill="none">
                <rect x="3" y="8" width="11" height="7.5" rx="2.2" stroke="white" strokeWidth="1.6" />
                <path d="M6 8V6a2.5 2.5 0 015 0v2" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="8.5" cy="11.5" r="1.1" fill="white" />
              </svg>
              <input 
                className="glass-input" 
                type="password" 
                placeholder="Digite sua senha" 
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <div className="divider"><hr /><span>ou</span><hr /></div>
        
        <div className="secondary-row">
          <button type="button" className="btn-secondary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: '6px' }}>
              <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" />
              <path d="M7 4.5v3l1.5 1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Esqueci a senha
          </button>
          
          <button type="button" className="btn-secondary" onClick={() => navigate('/cadastro')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: '6px' }}>
              <rect x="1" y="3" width="12" height="8" rx="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" />
              <path d="M1 5l6 4 6-4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Solicitar Cadastro
          </button>
        </div>
        
        <p className="card-footer">Instituto Federal Educação, Ciência e Tecnologia do Maranhão &mdash; IFMA &copy; 2026</p>
      </div>
    </>
  );
}