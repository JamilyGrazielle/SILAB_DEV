import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Reservas.css';

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    laboratorioId: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    motivo: '',
    recorrente: false,
    dataFimRecorrencia: ''
  });

  // Identifica o perfil e busca as reservas apropriadas
  const fetchReservas = async (userRole) => {
    setLoading(true);
    try {
      const endpoint = userRole === 'PROFESSOR' ? '/reservas/minhas' : '/reservas';
      const response = await api.get(endpoint);
      setReservas(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Busca os laboratórios para preencher o Select no modal
  const fetchLaboratorios = async () => {
    try {
      const response = await api.get('/laboratorios');
      // Filtra apenas os que estão disponíveis
      const labsDisponiveis = (response.data || []).filter(lab => lab.status === 'DISPONIVEL');
      setLaboratorios(labsDisponiveis);
    } catch (error) {
      console.error("Erro ao buscar laboratórios:", error);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem('silab_perfil');
    setPerfil(userRole);
    fetchReservas(userRole);
    if (userRole === 'PROFESSOR') {
      fetchLaboratorios();
    }
  }, []);

  const openCreateModal = () => {
    setFormData({
      laboratorioId: '',
      data: '',
      horaInicio: '',
      horaFim: '',
      motivo: '',
      recorrente: false,
      dataFimRecorrencia: ''
    });
    setErro('');
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    if (formData.recorrente && !formData.dataFimRecorrencia) {
      setErro('Informe a data final para a repetição.');
      return;
    }

    setIsSaving(true);
    setErro('');

    try {
      // Converte horários para o formato HH:mm exigido pelo LocalTime se necessário
      // O input time do html já manda HH:mm (ex: "08:30")
      const payload = {
        laboratorioId: Number(formData.laboratorioId),
        data: formData.data,
        horaInicio: formData.horaInicio,
        horaFim: formData.horaFim,
        motivo: formData.motivo,
        recorrente: formData.recorrente,
        dataFimRecorrencia: formData.recorrente ? formData.dataFimRecorrencia : null
      };

      await api.post('/reservas', payload);
      setIsModalOpen(false);
      fetchReservas(perfil);
    } catch (error) {
      if (error.response && error.response.data) {
        setErro(error.response.data.message || 'Erro ao criar reserva. Verifique horários e conflitos.');
      } else {
        setErro('Erro ao se comunicar com o servidor.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta reserva?")) return;
    
    try {
      await api.patch(`/reservas/${id}/cancelar`);
      fetchReservas(perfil);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao cancelar a reserva.');
    }
  };

  // Formata data de AAAA-MM-DD para DD/MM/AAAA
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Formata hora de HH:mm:ss para HH:mm
  const formatarHora = (horaString) => {
    if (!horaString) return '';
    return horaString.substring(0, 5);
  };

  return (
    <div className="reservas-container">
      <div className="reservas-header">
        <div className="reservas-title">
          <h2>{perfil === 'PROFESSOR' ? 'Minhas Reservas' : 'Todas as Reservas'}</h2>
          <p>Acompanhe e gerencie a agenda dos laboratórios.</p>
        </div>
        {/* Só exibe o botão se for PROFESSOR */}
        {perfil === 'PROFESSOR' && (
          <button className="btn-add-reserva" onClick={openCreateModal}>
            + Nova Reserva
          </button>
        )}
      </div>

      <div className="reservas-content">
        {loading ? (
          <div className="reservas-loading">Carregando agendamentos...</div>
        ) : (!reservas || reservas.length === 0) ? (
          <div className="reservas-empty">Nenhuma reserva encontrada.</div>
        ) : (
          <div className="reservas-grid">
            {reservas.map(reserva => (
              <div key={reserva.id} className="reserva-card">
                <div className="reserva-card-header">
                  <h3>{reserva.nomeLaboratorio}</h3>
                  <span className={`status-badge-reserva ${reserva.status.toLowerCase()}`}>
                    {reserva.status}
                  </span>
                </div>
                
                <div className="reserva-card-body">
                  {/* Se for Admin/Root, mostra quem fez a reserva */}
                  {(perfil === 'ADMIN' || perfil === 'ROOT') && (
                    <p className="reserva-professor"><strong>Prof:</strong> {reserva.nomeProfessor}</p>
                  )}
                  <p><strong>Data:</strong> {formatarData(reserva.data)}</p>
                  <p><strong>Horário:</strong> {formatarHora(reserva.horaInicio)} às {formatarHora(reserva.horaFim)}</p>
                  <p><strong>Motivo:</strong> {reserva.motivo}</p>
                </div>
                
                <div className="reserva-card-footer">
                  {reserva.status === 'CONFIRMADA' && (
                    <button className="btn-cancel-reserva" onClick={() => handleCancelar(reserva.id)}>
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE CRIAÇÃO - Visível apenas para o PROFESSOR quando clica no botão */}
      {isModalOpen && perfil === 'PROFESSOR' && (
        <div className="reserva-modal-overlay">
          <div className="reserva-modal-box">
            <div className="reserva-modal-header">
              <h3>Agendar Laboratório</h3>
              <button type="button" className="btn-close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSalvar}>
              {erro && <div className="modal-error">{erro}</div>}
              
              <div className="reserva-modal-body">
                <div className="input-group">
                  <label>Laboratório</label>
                  <select name="laboratorioId" value={formData.laboratorioId} onChange={handleChange} required>
                    <option value="" disabled>Selecione um laboratório disponível</option>
                    {laboratorios.map(lab => (
                      <option key={lab.id} value={lab.id}>{lab.nome} (Cap: {lab.capacidade})</option>
                    ))}
                  </select>
                </div>
                
                <div className="input-group">
                  <label>Data da Reserva</label>
                  <input type="date" name="data" value={formData.data} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
                </div>

                <div className="row-group">
                  <div className="input-group half">
                    <label>Hora Início</label>
                    <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
                  </div>
                  <div className="input-group half">
                    <label>Hora Fim</label>
                    <input type="time" name="horaFim" value={formData.horaFim} onChange={handleChange} required />
                  </div>
                </div>

                <div className="input-group">
                  <label>Motivo da Aula/Reserva</label>
                  <input type="text" name="motivo" value={formData.motivo} onChange={handleChange} required placeholder="Ex: Aula prática de POO" />
                </div>

                <div className="checkbox-group">
                  <label>
                    <input type="checkbox" name="recorrente" checked={formData.recorrente} onChange={handleChange} />
                    Repetir semanalmente?
                  </label>
                </div>

                {/* Exibe o campo de data final se "recorrente" estiver marcado */}
                {formData.recorrente && (
                  <div className="input-group recurring-box">
                    <label>Até quando deve repetir?</label>
                    <input type="date" name="dataFimRecorrencia" value={formData.dataFimRecorrencia} onChange={handleChange} required min={formData.data || new Date().toISOString().split('T')[0]} />
                  </div>
                )}
              </div>

              <div className="reserva-modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancelar</button>
                <button type="submit" className="btn-save" disabled={isSaving}>
                  {isSaving ? 'Agendando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}