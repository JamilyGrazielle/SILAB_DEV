import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Usuarios.css';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('usuarios'); // 'usuarios' ou 'solicitacoes'
  const [perfilLogado, setPerfilLogado] = useState('');

  // Modal de cadastro manual
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    email: '',
    perfil: 'PROFESSOR',
    senha: '',
    confirmaSenha: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Faz as duas requisições simultaneamente para ser mais rápido
      const [resUsuarios, resSolicitacoes] = await Promise.all([
        api.get('/usuarios'),
        api.get('/solicitacoes')
      ]);
      setUsuarios(resUsuarios.data || []);
      
      // Filtra para mostrar apenas as pendentes na tela
      const pendentes = (resSolicitacoes.data || []).filter(s => s.status === 'PENDENTE');
      setSolicitacoes(pendentes);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('silab_perfil');
    setPerfilLogado(role);
    fetchData();
  }, []);

  // --- AÇÕES DE SOLICITAÇÕES ---
  const handleAprovar = async (id) => {
    try {
      await api.patch(`/solicitacoes/${id}/aprovar`);
      fetchData(); // Recarrega os dados
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao aprovar.');
    }
  };

  const handleRejeitar = async (id) => {
    if (!window.confirm('Deseja realmente rejeitar esta solicitação?')) return;
    try {
      await api.patch(`/solicitacoes/${id}/rejeitar`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao rejeitar.');
    }
  };

  // --- AÇÕES DE USUÁRIOS ---
  const handleToggleStatus = async (usuario) => {
    const novoStatus = usuario.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    const acao = novoStatus === 'INATIVO' ? 'bloquear' : 'desbloquear';
    
    if (!window.confirm(`Deseja realmente ${acao} o acesso de ${usuario.nome}?`)) return;

    try {
      await api.patch(`/usuarios/${usuario.id}/status`, { status: novoStatus });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || `Erro ao ${acao} usuário.`);
    }
  };

  // --- CADASTRO MANUAL ---
  const openCreateModal = () => {
    setFormData({
      nome: '', matricula: '', email: '', perfil: 'PROFESSOR', senha: '', confirmaSenha: ''
    });
    setErro('');
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvarManual = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    if (formData.senha !== formData.confirmaSenha) {
      setErro('As senhas não coincidem!');
      return;
    }

    setIsSaving(true);
    setErro('');

    try {
      await api.post('/usuarios', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      if (error.response && error.response.data) {
        setErro(error.response.data.message || error.response.data);
      } else {
        setErro('Erro ao cadastrar usuário.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <div className="usuarios-title">
          <h2>Gestão de Acessos</h2>
          <p>Gerencie quem tem permissão para utilizar o sistema.</p>
        </div>
        <button className="btn-add-usuario" onClick={openCreateModal}>
          + Cadastrar Usuário
        </button>
      </div>

      {/* ABAS DE NAVEGAÇÃO */}
      <div className="usuarios-tabs">
        <button 
          className={activeTab === 'usuarios' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('usuarios')}
        >
          Usuários Cadastrados
        </button>
        <button 
          className={activeTab === 'solicitacoes' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('solicitacoes')}
        >
          Solicitações Pendentes 
          {solicitacoes.length > 0 && <span className="badge-count">{solicitacoes.length}</span>}
        </button>
      </div>

      <div className="usuarios-content">
        {loading ? (
          <div className="usuarios-loading">Carregando informações...</div>
        ) : activeTab === 'usuarios' ? (
          /* LISTA DE USUÁRIOS */
          (!usuarios || usuarios.length === 0) ? (
            <div className="usuarios-empty">Nenhum usuário encontrado.</div>
          ) : (
            <div className="usuarios-grid">
              {usuarios.map(user => (
                <div key={user.id} className="usuario-card">
                  <div className="usuario-card-header">
                    <h3>{user.nome}</h3>
                    <span className={`status-badge-user ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="usuario-card-body">
                    <p><strong>Matrícula:</strong> {user.matricula}</p>
                    <p><strong>E-mail:</strong> {user.email}</p>
                    <p><strong>Perfil:</strong> {user.perfil}</p>
                  </div>
                  <div className="usuario-card-footer">
                    {/* ROOT não pode inativar outro ROOT (regra do seu backend) */}
                    {!(perfilLogado === 'ROOT' && user.perfil === 'ROOT') && (
                      <button 
                        className={`btn-toggle-status ${user.status === 'ATIVO' ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.status === 'ATIVO' ? 'Bloquear Acesso' : 'Liberar Acesso'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* LISTA DE SOLICITAÇÕES */
          (!solicitacoes || solicitacoes.length === 0) ? (
            <div className="usuarios-empty">Nenhuma solicitação pendente no momento.</div>
          ) : (
            <div className="usuarios-grid">
              {solicitacoes.map(solic => (
                <div key={solic.id} className="solicitacao-card">
                  <div className="solicitacao-card-header">
                    <h3>{solic.nome}</h3>
                    <span className="badge-pendente">AGUARDANDO</span>
                  </div>
                  <div className="solicitacao-card-body">
                    <p><strong>Matrícula:</strong> {solic.matricula}</p>
                    <p><strong>E-mail:</strong> {solic.email}</p>
                    <p><strong>Data:</strong> {new Date(solic.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="solicitacao-actions">
                    <button className="btn-approve" onClick={() => handleAprovar(solic.id)}>Aprovar</button>
                    <button className="btn-reject" onClick={() => handleRejeitar(solic.id)}>Rejeitar</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* MODAL DE CADASTRO MANUAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Cadastrar Novo Usuário</h3>
              <button type="button" className="btn-close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSalvarManual}>
              {erro && <div className="modal-error">{erro}</div>}
              
              <div className="modal-body">
                <div className="input-group">
                  <label>Nome Completo</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>
                
                <div className="row-group">
                  <div className="input-group half">
                    <label>Matrícula</label>
                    <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required />
                  </div>
                  <div className="input-group half">
                    <label>Perfil</label>
                    <select name="perfil" value={formData.perfil} onChange={handleChange} required>
                      <option value="PROFESSOR">Professor</option>
                      {/* Apenas ROOT pode criar ADMIN */}
                      {perfilLogado === 'ROOT' && <option value="ADMIN">Administrador</option>}
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>E-mail</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="row-group">
                  <div className="input-group half">
                    <label>Senha</label>
                    <input type="password" name="senha" value={formData.senha} onChange={handleChange} required minLength="6" />
                  </div>
                  <div className="input-group half">
                    <label>Confirmar Senha</label>
                    <input type="password" name="confirmaSenha" value={formData.confirmaSenha} onChange={handleChange} required minLength="6" />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancelar</button>
                <button type="submit" className="btn-save-user" disabled={isSaving}>
                  {isSaving ? 'Salvando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}