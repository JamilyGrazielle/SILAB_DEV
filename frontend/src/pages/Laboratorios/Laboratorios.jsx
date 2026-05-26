import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Verifique se este caminho está correto no seu projeto!
import './Laboratorios.css';

export default function Laboratorios() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); 
  const [isSaving, setIsSaving] = useState(false); 
  const [erro, setErro] = useState('');

  // Estado do Formulário
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    capacidade: '',
    equipamentos: []
  });

  // Estado para os inputs rápidos de equipamento
  const [equipInput, setEquipInput] = useState({ nome: '', quantidade: '' });

  // Buscar laboratórios ao carregar a página
  const fetchLaboratorios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/laboratorios');
      setLaboratorios(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar laboratórios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaboratorios();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ id: null, nome: '', capacidade: '', equipamentos: [] });
    setEquipInput({ nome: '', quantidade: '' });
    setErro('');
    setIsModalOpen(true);
  };

  const openEditModal = (lab) => {
    setModalMode('edit');
    setFormData({
      id: lab.id,
      nome: lab.nome,
      capacidade: lab.capacidade,
      equipamentos: lab.equipamentos || [] // Blindagem contra null
    });
    setEquipInput({ nome: '', quantidade: '' });
    setErro('');
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEquipChange = (e) => {
    setEquipInput({ ...equipInput, [e.target.name]: e.target.value });
  };

  const handleAddEquipamento = async () => {
    if (!equipInput.nome || !equipInput.quantidade) return;

    if (modalMode === 'create') {
      setFormData({
        ...formData,
        equipamentos: [...(formData.equipamentos || []), { nome: equipInput.nome, quantidade: Number(equipInput.quantidade) }]
      });
      setEquipInput({ nome: '', quantidade: '' });
    } else {
      try {
        await api.post(`/laboratorios/${formData.id}/equipamentos`, {
          nome: equipInput.nome,
          quantidade: Number(equipInput.quantidade)
        });
        const res = await api.get(`/laboratorios/${formData.id}`);
        setFormData({ ...formData, equipamentos: res.data.equipamentos || [] });
        setEquipInput({ nome: '', quantidade: '' });
        fetchLaboratorios(); 
      } catch (error) {
        const msg = error.response?.data?.message || error.response?.data;
        setErro(typeof msg === 'string' ? msg : 'Erro ao adicionar equipamento.')
      }
    }
  };

  const handleRemoveEquipamento = async (index, equipId) => {
    if (modalMode === 'create') {
      const novosEquips = (formData.equipamentos || []).filter((_, i) => i !== index);
      setFormData({ ...formData, equipamentos: novosEquips });
    } else {
      try {
        await api.delete(`/laboratorios/${formData.id}/equipamentos/${equipId}`);
        const novosEquips = (formData.equipamentos || []).filter(e => e.id !== equipId);
        setFormData({ ...formData, equipamentos: novosEquips });
        fetchLaboratorios();
      } catch (error) {
        const msg = error.response?.data?.message || error.response?.data;
        setErro(typeof msg === 'string' ? msg : 'Erro ao remover equipamento.');
      }
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (isSaving) return; 

    setIsSaving(true);
    setErro('');

    try {
      if (modalMode === 'create') {
        const payload = {
          nome: formData.nome,
          capacidade: Number(formData.capacidade),
          equipamentos: formData.equipamentos || []
        };
        await api.post('/laboratorios/cadastrar', payload);
      } else {
        const payload = {
          nome: formData.nome,
          capacidade: Number(formData.capacidade),
          equipamentos: [] 
        };
        await api.put(`/laboratorios/${formData.id}`, payload);
      }
      
      setIsModalOpen(false);
      fetchLaboratorios(); 
    } catch (error) {
      if (error.response && error.response.data) {
        const msg = error.response.data.message || error.response.data;
        setErro(typeof msg === 'string' ? msg : 'Erro ao salvar laboratório.');
      } else {
        setErro('Erro ao salvar laboratório.');
      }
    } finally {
      setIsSaving(false); 
    }
  };

  return (
    <div className="labs-container">
      <div className="labs-header">
        <div className="labs-title">
          <h2>Gerenciar Laboratórios</h2>
          <p>Adicione, edite ou gerencie equipamentos das salas.</p>
        </div>
        <button className="btn-add-lab" onClick={openCreateModal}>
          + Novo Laboratório
        </button>
      </div>

      <div className="labs-content">
        {loading ? (
          <div className="labs-loading">Carregando laboratórios...</div>
        ) : (!laboratorios || laboratorios.length === 0) ? (
          <div className="labs-empty">Nenhum laboratório cadastrado.</div>
        ) : (
          <div className="labs-grid">
            {laboratorios.map(lab => (
              <div key={lab.id} className="lab-card">
                <div className="lab-card-header">
                  <h3>{lab.nome}</h3>
                  <span className={`status-badge ${lab.status === 'DISPONIVEL' ? 'disponivel' : 'manutencao'}`}>
                    {lab.status === 'DISPONIVEL' ? 'Disponível' : 'Em Manutenção'}
                  </span>
                </div>
                <div className="lab-card-body">
                  <p><strong>Capacidade:</strong> {lab.capacidade} alunos</p>
                  {/* Blindagem no reduce: garante que seja um array antes de somar */}
                  <p><strong>Equipamentos:</strong> {(lab.equipamentos || []).reduce((acc, eq) => acc + (eq.quantidade || 0), 0)} itens totais</p>
                </div>
                <div className="lab-card-footer">
                  <button className="btn-edit-lab" onClick={() => openEditModal(lab)}>
                    Editar / Equipamentos
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{modalMode === 'create' ? 'Cadastrar Novo Laboratório' : 'Editar Laboratório'}</h3>
              <button type="button" className="btn-close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSalvar}>
              {erro && <div className="modal-error">{erro}</div>}
              
              <div className="modal-body">
                <div className="input-group">
                  <label>Nome do Laboratório</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Ex: Lab de Redes 01" />
                </div>
                
                <div className="input-group">
                  <label>Capacidade (Alunos)</label>
                  <input type="number" name="capacidade" value={formData.capacidade} onChange={handleChange} required min="1" placeholder="Ex: 30" />
                </div>

                <div className="equipamentos-section">
                  <label>Equipamentos</label>
                  <div className="equip-add-row">
                    <input type="text" name="nome" value={equipInput.nome} onChange={handleEquipChange} placeholder="Nome (Ex: Computador)" />
                    <input type="number" name="quantidade" value={equipInput.quantidade} onChange={handleEquipChange} min="1" placeholder="Qtd" />
                    <button type="button" className="btn-add-equip" onClick={handleAddEquipamento}>Adicionar</button>
                  </div>

                  <ul className="equip-list">
                    {(!formData.equipamentos || formData.equipamentos.length === 0) && <li className="equip-empty">Nenhum equipamento adicionado.</li>}
                    {(formData.equipamentos || []).map((equip, index) => (
                      <li key={equip.id || index}>
                        <span><strong>{equip.quantidade}x</strong> {equip.nome}</span>
                        <button type="button" className="btn-del-equip" onClick={() => handleRemoveEquipamento(index, equip.id)}>
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancelar</button>
                <button type="submit" className="btn-save" disabled={isSaving}>
                  {isSaving ? 'Salvando...' : 'Salvar Laboratório'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}