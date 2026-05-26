import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Agenda.css';

const HORARIOS = [
  { inicio: '08:00', fim: '08:49', turno: 'Matutino' },
  { inicio: '08:50', fim: '09:39', turno: 'Matutino' },
  { inicio: '10:00', fim: '10:49', turno: 'Matutino' },
  { inicio: '10:50', fim: '11:39', turno: 'Matutino' },
  { inicio: '11:40', fim: '12:30', turno: 'Matutino' },
  { inicio: '14:00', fim: '14:49', turno: 'Vespertino' },
  { inicio: '14:50', fim: '15:39', turno: 'Vespertino' },
  { inicio: '15:55', fim: '16:44', turno: 'Vespertino' },
  { inicio: '16:45', fim: '17:34', turno: 'Vespertino' },
  { inicio: '17:35', fim: '18:25', turno: 'Vespertino' },
  { inicio: '18:30', fim: '19:19', turno: 'Noturno' },
  { inicio: '19:20', fim: '20:09', turno: 'Noturno' },
  { inicio: '20:10', fim: '20:59', turno: 'Noturno' },
  { inicio: '21:00', fim: '21:49', turno: 'Noturno' },
  { inicio: '21:50', fim: '22:40', turno: 'Noturno' },
];

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function Agenda() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [laboratorioId, setLaboratorioId] = useState('');
  const [semana, setSemana] = useState('');
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalReserva, setModalReserva] = useState(null);

  useEffect(() => {
    api.get('/laboratorios').then(res => {
      const labs = res.data || [];
      setLaboratorios(labs);
      if (labs.length > 0) setLaboratorioId(labs[0].id);
    });

    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const diff = diaSemana === 0 ? -6 : 1 - diaSemana;
    const segunda = new Date(hoje);
    segunda.setDate(hoje.getDate() + diff);
    setSemana(segunda.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (!laboratorioId || !semana) return;
    setLoading(true);
    api.get(`/agenda?laboratorioId=${laboratorioId}&semana=${semana}`)
      .then(res => setReservas(res.data.reservas || []))
      .catch(() => setReservas([]))
      .finally(() => setLoading(false));
  }, [laboratorioId, semana]);

  const diasDaSemana = semana ? Array.from({ length: 7 }, (_, i) => {
    const d = new Date(semana + 'T00:00:00');
    d.setDate(d.getDate() + i);
    return d;
  }) : [];

  const getReserva = (horario, data) => {
    const dataStr = data.toISOString().split('T')[0];
    return reservas.find(r =>
      r.data === dataStr &&
      r.horaInicio.substring(0, 5) === horario.inicio
    );
  };

  const semanaAnterior = () => {
    const d = new Date(semana + 'T00:00:00');
    d.setDate(d.getDate() - 7);
    setSemana(d.toISOString().split('T')[0]);
  };

  const proximaSemana = () => {
    const d = new Date(semana + 'T00:00:00');
    d.setDate(d.getDate() + 7);
    setSemana(d.toISOString().split('T')[0]);
  };

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <h2>Agenda de Laboratórios</h2>
        <p>Consulte a disponibilidade dos laboratórios.</p>
      </div>

    <div className="agenda-filtros">
      <select value={laboratorioId} onChange={e => setLaboratorioId(e.target.value)}>
        {laboratorios.map(l => (
          <option key={l.id} value={l.id}>{l.nome}</option>
        ))}
      </select>

      <div className="semana-nav">
        <button onClick={semanaAnterior}>&#8249;</button>
        <span>
          {diasDaSemana.length > 0 && (
            `${diasDaSemana[0].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${diasDaSemana[6].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
          )}
        </span>
        <button onClick={proximaSemana}>&#8250;</button>
      </div>

      <div className="semana-filtro">
        <label style={{fontWeight:600}}>Ir para:</label>
        <input
          type="date"
          onChange={e => {
            if (!e.target.value) return;
            const d = new Date(e.target.value + 'T00:00:00');
            const diaSemana = d.getDay();
            const diff = diaSemana === 0 ? -6 : 1 - diaSemana;
            d.setDate(d.getDate() + diff);
            setSemana(d.toISOString().split('T')[0]);
          }}
        />
      </div>
    </div>

      {loading ? (
        <div className="agenda-loading">Carregando agenda...</div>
      ) : (
        <div className="agenda-table-wrapper">
          <table className="agenda-table">
            <thead>
              <tr>
                <th>Horário</th>
                {diasDaSemana.map((d, i) => (
                  <th key={i}>
                    {DIAS_SEMANA[i]}<br />
                    <span>{d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['Matutino', 'Vespertino', 'Noturno'].map(turno => (
                <React.Fragment key={turno}>
                  <tr className="turno-header">
                    <td colSpan={8}>{turno} ({turno === 'Matutino' ? '08:00 - 12:30' : turno === 'Vespertino' ? '14:00 - 18:25' : '18:30 - 22:40'})</td>
                  </tr>
                  {HORARIOS.filter(h => h.turno === turno).map(horario => (
                    <tr key={horario.inicio}>
                      <td className="hora-col">{horario.inicio} - {horario.fim}</td>
                      {diasDaSemana.map((d, i) => {
                        const reserva = getReserva(horario, d);
                        return (
                          <td key={i} className={`slot ${reserva ? 'ocupado' : 'disponivel'}`}>
                            {reserva ? (
                              <div className="slot-ocupado-content">
                                <button
                                  style={{margin: -5}}
                                  className="btn-info-reserva"
                                  onClick={() => setModalReserva(reserva)}
                                  title="Ver detalhes"
                                >
                                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                  </svg>
                                </button>
                                <span className="slot-motivo">{reserva.motivo}</span>
                              </div>
                            ) : (
                              <span className="slot-livre">Disponível</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalReserva && (
        <div className="modal-overlay" onClick={() => setModalReserva(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalhes da Reserva</h3>
              <button className="btn-close-modal" onClick={() => setModalReserva(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <strong>Laboratório:</strong> <span style={{color: "#0f172a"}}>{modalReserva.nomeLaboratorio}</span>
              </p>
              <p>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong>Professor:</strong> <span style={{color: "#0f172a"}}>{modalReserva.nomeProfessor}</span>
              </p>
              <p>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <strong>Data:</strong> <span style={{color: "#0f172a"}}>{new Date(modalReserva.data + 'T00:00:00').toLocaleDateString('pt-BR')}</span> 
              </p>
              <p>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <strong>Horário:</strong> <span style={{color: "#0f172a"}}>{modalReserva.horaInicio.substring(0, 5)} - {modalReserva.horaFim.substring(0, 5)}</span> 
              </p>
              <p>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <strong>Motivo:</strong> <span style={{color: "#0f172a"}}>{modalReserva.motivo}</span>
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setModalReserva(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}