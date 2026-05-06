import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Laboratorios.css';

export default function Laboratorios() {
  const navigate = useNavigate();
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  // Estados do Modal e Formulário
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLabId, setCurrentLabId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para travar o botão de salvar

  const [formData, setFormData] = useState({
    nome: '',
    capacidade: '',
    equipamentos: [] // Array de { nome: '', quantidade: '' }
  });

  // Função para buscar laboratórios (separada para podermos recarregar a lista depois de salvar/deletar)
  const fetchLaboratorios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/laboratorios');
      setLaboratorios(response.data);
      setErro('');
    } catch (error) {
      console.error("Erro ao buscar laboratórios:", error);
      setErro('Não foi possível carregar a lista de laboratórios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaboratorios();
  }, []);

  // --- FUNÇÕES DE EXCLUSÃO ---
  const handleRemover = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja remover o laboratório "${nome}"?`)) return;

    try {
      await api.delete(`/laboratorios/${id}`);
      alert('Laboratório removido com sucesso!');
      fetchLaboratorios(); // Recarrega a lista
    } catch (error) {
      // Aqui o seu backend já protege contra a remoção de laboratórios com reservas ativas!
      const mensagem = error.response?.data?.message || 'Erro ao remover laboratório. Ele pode ter reservas ativas.';
      alert(mensagem);
    }
  };

  // --- FUNÇÕES DO FORMULÁRIO (MODAL) ---
  const abrirModalNovo = () => {
    setIsEditing(false);
    setCurrentLabId(null);
    setFormData({ nome: '', capacidade: '', equipamentos: [] });
    setShowModal(true);
  };

  const abrirModalEditar = (lab) => {
    setIsEditing(true);
    setCurrentLabId(lab.id);
    setFormData({ 
      nome: lab.nome, 
      capacidade: lab.capacidade, 
      // Mapeamos os equipamentos que vieram do banco para o estado do formulário
      equipamentos: lab.equipamentos.map(eq => ({ nome: eq.nome, quantidade: eq.quantidade }))
    });
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- FUNÇÕES PARA EQUIPAMENTOS DINÂMICOS ---
  const addEquipamento = () => {
    setFormData({
      ...formData,
      equipamentos: [...formData.equipamentos, { nome: '', quantidade: '' }]
    });
  };

  const updateEquipamento = (index, campo, valor) => {
    const novosEquipamentos = [...formData.equipamentos];
    novosEquipamentos[index][campo] = valor;
    setFormData({ ...formData, equipamentos: novosEquipamentos });
  };

  const removeEquipamento = (index) => {
    const novosEquipamentos = formData.equipamentos.filter((_, i) => i !== index);
    setFormData({ ...formData, equipamentos: novosEquipamentos });
  };

  // --- SALVAR (POST / PUT) ---
  const handleSalvar = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Trava o botão para evitar envio duplicado

    try {
      if (isEditing) {
        // Envia a lista completa de equipamentos no PUT
        await api.put(`/laboratorios/${currentLabId}`, {
          nome: formData.nome,
          capacidade: parseInt(formData.capacidade),
          equipamentos: formData.equipamentos.map(eq => ({
            nome: eq.nome,
            quantidade: parseInt(eq.quantidade)
          }))
        });
        alert('Laboratório atualizado com sucesso!');
      } else {
        // Rota POST: Cadastra lab + equipamentos
        await api.post('/laboratorios/cadastrar', {
          nome: formData.nome,
          capacidade: parseInt(formData.capacidade),
          equipamentos: formData.equipamentos.map(eq => ({
            nome: eq.nome,
            quantidade: parseInt(eq.quantidade)
          }))
        });
        alert('Laboratório cadastrado com sucesso!');
      }
      fecharModal();
      fetchLaboratorios();
    } catch (error) {
      const mensagem = error.response?.data?.message || 'Erro ao salvar laboratório.';
      alert(mensagem);
    } finally {
      setIsSubmitting(false); // Libera o botão após o término (sucesso ou erro)
    }
  };

  return (
    <div className="labs-container">
      <header className="labs-header">
        <div className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao Dashboard
        </div>
        <h2>Gestão de Laboratórios</h2>
        <button className="btn-novo-lab" onClick={abrirModalNovo}>+ Novo Laboratório</button>
      </header>

      <main className="labs-main">
        {loading ? (
          <div className="loading-state">Carregando laboratórios...</div>
        ) : erro ? (
          <div className="error-state">{erro}</div>
        ) : laboratorios.length === 0 ? (
          <div className="empty-state">Nenhum laboratório cadastrado ainda.</div>
        ) : (
          <div className="labs-grid">
            {laboratorios.map((lab) => (
              <div key={lab.id} className="lab-card">
                <div className="lab-card-header">
                  <h3>{lab.nome}</h3>
                  <span className={`status-badge ${lab.status === 'DISPONIVEL' ? 'status-ok' : 'status-manutencao'}`}>
                    {lab.status === 'DISPONIVEL' ? 'Disponível' : 'Em Manutenção'}
                  </span>
                </div>
                
                <div className="lab-card-body">
                  <p><strong>Capacidade:</strong> {lab.capacidade} alunos</p>
                  <p><strong>Equipamentos:</strong> {lab.equipamentos.length} cadastrados</p>
                </div>

                <div className="lab-card-actions">
                  <button className="btn-action edit" onClick={() => abrirModalEditar(lab)}>Editar</button>
                  <button className="btn-action delete" onClick={() => handleRemover(lab.id, lab.nome)}>Remover</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Editar Laboratório' : 'Novo Laboratório'}</h3>
            <form onSubmit={handleSalvar}>
              
              <div className="form-group">
                <label>Nome do Laboratório</label>
                <input 
                  type="text" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Capacidade (Alunos)</label>
                <input 
                  type="number" 
                  name="capacidade" 
                  value={formData.capacidade} 
                  onChange={handleInputChange} 
                  min="1" 
                  required 
                />
              </div>

              {/* Seção de Equipamentos */}
              <div className="equipamentos-section">
                <div className="equipamentos-header">
                  <label>Equipamentos</label>
                  <button type="button" className="btn-add-eqp" onClick={addEquipamento}>+ Adicionar</button>
                </div>
                
                {formData.equipamentos.map((eq, index) => (
                  <div key={index} className="equipamento-row">
                    <input 
                      type="text" 
                      placeholder="Nome (ex: Computador)" 
                      value={eq.nome}
                      onChange={(e) => updateEquipamento(index, 'nome', e.target.value)}
                      required
                    />
                    <input 
                      type="number" 
                      placeholder="Qtd" 
                      value={eq.quantidade}
                      onChange={(e) => updateEquipamento(index, 'quantidade', e.target.value)}
                      min="1"
                      required
                    />
                    <button type="button" className="btn-remove-eqp" onClick={() => removeEquipamento(index)}>X</button>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancelar" 
                  onClick={fecharModal} 
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-confirmar" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}