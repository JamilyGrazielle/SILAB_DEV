import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Manutencoes.css';

export default function Manutencoes() {
  const [bloqueios, setBloqueios] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    laboratorioId: '',
    dataInicio: '',
    dataFim: '',
    motivo: ''
  });

  // Busca o histórico de manutenções
  const fetchBloqueios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bloqueios');
      setBloqueios(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar manutenções:", error);
    } finally {
      setLoading(false);
    }
  };

  // Busca os laboratórios para o select do modal
  const fetchLaboratorios = async () => {
    try {
      const response = await api.get('/laboratorios');
      setLaboratorios(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar laboratórios:", error);
    }
  };

  useEffect(() => {
    fetchBloqueios();
    fetchLaboratorios();
  }, []);

  const openCreateModal = () => {
    setFormData({
      laboratorioId: '',
      dataInicio: '',
      dataFim: '',
      motivo: ''
    });
    setErro('');
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    if (new Date(formData.dataFim) <= new Date(formData.dataInicio)) {
      setErro('A data final deve ser posterior à data de início.');
      return;
    }

    setIsSaving(true);
    setErro('');

    try {
      const payload = {
        laboratorioId: Number(formData.laboratorioId),
        dataInicio: formData.dataInicio, // Formato YYYY-MM-DDTHH:mm esperado pelo backend
        dataFim: formData.dataFim,
        motivo: formData.motivo
      };

      await api.post('/bloqueios', payload);
      setIsModalOpen(false);
      fetchBloqueios();
    } catch (error) {
      if (error.response && error.response.data) {
        setErro(error.response.data.message || 'Erro ao registrar manutenção.');
      } else {
        setErro('Erro de conexão com o servidor.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEncerrar = async (id) => {
    if (!window.confirm("Deseja realmente encerrar esta manutenção? O laboratório ficará disponível novamente.")) return;
    
    try {
      await api.patch(`/bloqueios/${id}/encerrar`);
      fetchBloqueios();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao encerrar manutenção.');
    }
  };

  // Formata Data e Hora (Ex: 2026-05-10T08:00 -> 10/05/2026 às 08:00)
  const formatarDataHora = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).replace(',', ' às');
  };

  return (
    <div className="manutencoes-container">
      <div className="manutencoes-header">
        <div className="manutencoes-title">
          <h2>Controle de Manutenções</h2>
          <p>Bloqueie laboratórios para reparos e visualize o histórico.</p>
        </div>
        <button className="btn-add-manutencao" onClick={openCreateModal}>
          + Registrar Manutenção
        </button>
      </div>

      <div className="manutencoes-content">
        {loading ? (
          <div className="manutencoes-loading">Carregando histórico...</div>
        ) : (!bloqueios || bloqueios.length === 0) ? (
          <div className="manutencoes-empty">Nenhum registro de manutenção encontrado.</div>
        ) : (
          <div className="manutencoes-grid">
            {bloqueios.map(bloqueio => (
              <div key={bloqueio.id} className="manutencao-card">
                <div className="manutencao-card-header">
                  <h3>{bloqueio.nomeLaboratorio}</h3>
                  <span className={`status-badge-manut ${bloqueio.ativo ? 'ativo' : 'encerrado'}`}>
                    {bloqueio.ativo ? 'Em Andamento' : 'Encerrada'}
                  </span>
                </div>
                
                <div className="manutencao-card-body">
                  <p><strong>Início:</strong> {formatarDataHora(bloqueio.dataInicio)}</p>
                  <p><strong>Previsão de Fim:</strong> {formatarDataHora(bloqueio.dataFim)}</p>
                  <p className="motivo-box"><strong>Motivo:</strong> {bloqueio.motivo}</p>
                </div>
                
                <div className="manutencao-card-footer">
                  {bloqueio.ativo && (
                    <button className="btn-encerrar-manutencao" onClick={() => handleEncerrar(bloqueio.id)}>
                      Encerrar Antecipadamente
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE CRIAÇÃO */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Registrar Manutenção</h3>
              <button type="button" className="btn-close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSalvar}>
              {erro && <div className="modal-error">{erro}</div>}
              
              <div className="modal-body">
                <div className="warning-box">
                  <p><strong>Atenção:</strong> Ao confirmar, o laboratório ficará indisponível e todas as reservas confirmadas neste período serão canceladas automaticamente.</p>
                </div>

                <div className="input-group">
                  <label>Laboratório</label>
                  <select name="laboratorioId" value={formData.laboratorioId} onChange={handleChange} required>
                    <option value="" disabled>Selecione um laboratório</option>
                    {laboratorios.map(lab => (
                      <option key={lab.id} value={lab.id}>{lab.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="row-group">
                  <div className="input-group half">
                    <label>Data e Hora Início</label>
                    <input type="datetime-local" name="dataInicio" value={formData.dataInicio} onChange={handleChange} required />
                  </div>
                  <div className="input-group half">
                    <label>Data e Hora Fim</label>
                    <input type="datetime-local" name="dataFim" value={formData.dataFim} onChange={handleChange} required />
                  </div>
                </div>

                <div className="input-group">
                  <label>Motivo da Manutenção</label>
                  <textarea 
                    name="motivo" 
                    value={formData.motivo} 
                    onChange={handleChange} 
                    required 
                    placeholder="Descreva o motivo da interdição (Ex: Troca de cabeamento de rede)"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancelar</button>
                <button type="submit" className="btn-save-warning" disabled={isSaving}>
                  {isSaving ? 'Registrando...' : 'Confirmar Interdição'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}