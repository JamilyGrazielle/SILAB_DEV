import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Reservas.css';

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState('');
  const [horariosSelected, setHorariosSelected] = useState([]);
  
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

  const horarios = [
    { inicio: '08:00', fim: '08:49' },
    { inicio: '08:50', fim: '09:39' },
    { inicio: '10:00', fim: '10:49' },
    { inicio: '10:50', fim: '11:39' },
    { inicio: '11:40', fim: '12:30' },
    { inicio: '14:00', fim: '14:49' },
    { inicio: '14:50', fim: '15:39' },
    { inicio: '15:55', fim: '16:44' },
    { inicio: '16:45', fim: '17:34' },
    { inicio: '17:35', fim: '18:25' },
    { inicio: '18:30', fim: '19:19' },
    { inicio: '19:20', fim: '20:09' },
    { inicio: '20:10', fim: '20:59' },
    { inicio: '21:00', fim: '21:49' },
    { inicio: '21:50', fim: '22:40' },
  ];

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
    setHorariosSelected([]);
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

  const toggleHorario = (h) => {
    setHorariosSelected(prev =>
      prev.find(x => x.inicio === h.inicio)
        ? prev.filter(x => x.inicio !== h.inicio)
        : [...prev, h]
    );
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    if (horariosSelected.length === 0) {
      setErro('Selecione pelo menos um horário.');
      return;
    }

    if (formData.recorrente && !formData.dataFimRecorrencia) {
      setErro('Informe a data final para a repetição.');
      return;
    }

    setIsSaving(true);
    setErro('');

    try {
      let erros = [];
      for (const h of horariosSelected) {
        try {
          await api.post('/reservas', {
            laboratorioId: Number(formData.laboratorioId),
            data: formData.data,
            horaInicio: h.inicio,
            horaFim: h.fim,
            motivo: formData.motivo,
            recorrente: formData.recorrente,
            dataFimRecorrencia: formData.recorrente ? formData.dataFimRecorrencia : null
          });
        } catch (error) {
          erros.push(`${h.inicio} - ${h.fim}`);
        }
      }

      if (erros.length > 0 && erros.length === horariosSelected.length) {
        setErro('Nenhuma reserva foi criada. Todos os horários selecionados já estão ocupados.');
      } else {
        setIsModalOpen(false);
        fetchReservas(perfil);
        if (erros.length > 0) {
          alert(`Algumas reservas foram criadas! Porém os seguintes horários já estavam ocupados e foram ignorados:\n${erros.join('\n')}`);
        } 
      }

    } catch (error) {
      setErro('Erro ao se comunicar com o servidor.');
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

                <div className="input-group">
                  <label>Horários <span className="horario-hint">Selecione um ou mais</span></label>
                  <div className="horarios-grid">
                    {horarios.map(h => (
                      <button
                        key={h.inicio}
                        type="button"
                        className={`horario-btn ${horariosSelected.find(x => x.inicio === h.inicio) ? 'selected' : ''}`}
                        onClick={() => toggleHorario(h)}
                      >
                        {h.inicio} - {h.fim}
                      </button>
                    ))}
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