import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Manutencoes.css';

export default function Manutencoes() {
  const navigate = useNavigate();
  const [bloqueios, setBloqueios] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    laboratorioId: '',
    dataInicio: '',
    dataFim: '',
    motivo: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Busca o histórico de bloqueios e a lista de laboratórios em paralelo
      const [resBloqueios, resLabs] = await Promise.all([
        api.get('/bloqueios'),
        api.get('/laboratorios')
      ]);
      setBloqueios(resBloqueios.data);
      setLaboratorios(resLabs.data);
    } catch (error) {
      console.error("Erro ao buscar dados de manutenção:", error);
      alert('Erro ao carregar a página de manutenções.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEncerrar = async (id, nomeLab) => {
    if (!window.confirm(`Deseja realmente encerrar a manutenção do ${nomeLab} e liberá-lo para reservas?`)) return;

    try {
      await api.patch(`/bloqueios/${id}/encerrar`);
      alert('Manutenção encerrada. O laboratório já está disponível!');
      fetchData(); // Atualiza a lista
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao encerrar manutenção.');
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/bloqueios', {
        laboratorioId: parseInt(formData.laboratorioId),
        dataInicio: formData.dataInicio, // O input datetime-local já envia no formato compatível com o Spring
        dataFim: formData.dataFim,
        motivo: formData.motivo
      });
      alert('Laboratório bloqueado com sucesso! Reservas conflitantes foram canceladas.');
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao criar bloqueio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="manu-container">
      <header className="manu-header">
        <div className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao Dashboard
        </div>
        <h2>Gestão de Manutenções</h2>
        <button className="btn-novo-bloqueio" onClick={() => {
          setFormData({ laboratorioId: '', dataInicio: '', dataFim: '', motivo: '' });
          setShowModal(true);
        }}>+ Agendar Manutenção</button>
      </header>

      <main className="manu-main">
        {loading ? (
          <div className="loading-state">Carregando histórico...</div>
        ) : bloqueios.length === 0 ? (
          <div className="empty-state">Nenhum registro de manutenção encontrado.</div>
        ) : (
          <div className="table-responsive">
            <table className="manu-table">
              <thead>
                <tr>
                  <th>Laboratório</th>
                  <th>Início</th>
                  <th>Fim Previsto</th>
                  <th>Motivo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {bloqueios.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.nomeLaboratorio}</strong></td>
                    <td>{formatarData(b.dataInicio)}</td>
                    <td>{formatarData(b.dataFim)}</td>
                    <td>{b.motivo}</td>
                    <td>
                      <span className={`status-badge ${b.ativo ? 'status-manutencao' : 'status-ok'}`}>
                        {b.ativo ? 'Em Manutenção' : 'Encerrado'}
                      </span>
                    </td>
                    <td>
                      {b.ativo && (
                        <button className="btn-encerrar" onClick={() => handleEncerrar(b.id, b.nomeLaboratorio)}>
                          Liberar Sala
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal de Agendamento */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agendar Manutenção</h3>
            <p className="modal-aviso">Atenção: Ao salvar, todas as reservas confirmadas neste período serão canceladas automaticamente.</p>
            
            <form onSubmit={handleSalvar}>
              <div className="form-group">
                <label>Laboratório</label>
                <select 
                  value={formData.laboratorioId} 
                  onChange={(e) => setFormData({...formData, laboratorioId: e.target.value})}
                  required
                >
                  <option value="">Selecione um laboratório...</option>
                  {/* Lista apenas laboratórios que estão disponíveis */}
                  {laboratorios.filter(l => l.status === 'DISPONIVEL').map(lab => (
                    <option key={lab.id} value={lab.id}>{lab.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data/Hora Início</label>
                  <input 
                    type="datetime-local" 
                    value={formData.dataInicio} 
                    onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Data/Hora Fim</label>
                  <input 
                    type="datetime-local" 
                    value={formData.dataFim} 
                    onChange={(e) => setFormData({...formData, dataFim: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Motivo da Manutenção</label>
                <textarea 
                  rows="3"
                  value={formData.motivo} 
                  onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                  placeholder="Ex: Troca do ar-condicionado, pintura..."
                  required 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="btn-confirmar-bloqueio" disabled={isSubmitting}>
                  {isSubmitting ? 'Bloqueando...' : 'Confirmar Bloqueio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}