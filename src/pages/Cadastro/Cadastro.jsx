import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logoSilab from '../../assets/logo-silab.svg';
import './Cadastro.css';

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    email: '',
    senha: '',
    confirmaSenha: ''
  });

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (formData.senha !== formData.confirmaSenha) {
      setErro('As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/cadastro', formData);
      setSucesso(response.data);
      setFormData({ nome: '', matricula: '', email: '', senha: '', confirmaSenha: '' });
    } catch (error) {
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data)) {
           setErro(error.response.data[0].mensagem);
        } else {
           setErro(error.response.data.message || 'Erro ao realizar solicitação.');
        }
      } else {
        setErro('Não foi possível conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-layer"></div>

      <div className="card card-cadastro">
        <div className="logo-area" style={{ marginBottom: '1rem' }}>
          <div className="logo-box" style={{ width: '130px', height: '52px' }}>
            <img src={logoSilab} alt="Logo SILAB" style={{ width: '100%', height: '100%' }} />
          </div>
          <span className="sys-subtitle" style={{ fontSize: '13px' }}>
            Solicitação de Cadastro - Professor
          </span>
        </div>

        <form onSubmit={handleCadastro}>
          {erro && <div className="error-message">{erro}</div>}
          {sucesso && <div className="success-message">{sucesso}</div>}

          <div className="field-group">
            <label className="field-label">Nome Completo</label>
            <div className="field-wrap">
              <input className="glass-input" style={{ paddingLeft: '14px' }} type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Matrícula</label>
            <div className="field-wrap">
              <input className="glass-input" style={{ paddingLeft: '14px' }} type="text" name="matricula" value={formData.matricula} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">E-mail</label>
            <div className="field-wrap">
              <input className="glass-input" style={{ paddingLeft: '14px' }} type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Senha</label>
            <div className="field-wrap">
              <input className="glass-input" style={{ paddingLeft: '14px' }} type="password" name="senha" value={formData.senha} onChange={handleChange} required minLength="6" />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Confirmar Senha</label>
            <div className="field-wrap">
              <input className="glass-input" style={{ paddingLeft: '14px' }} type="password" name="confirmaSenha" value={formData.confirmaSenha} onChange={handleChange} required minLength="6" />
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Enviando...' : 'Solicitar Cadastro'}
          </button>
        </form>

        <Link to="/" className="link-voltar">
          ← Voltar para o login
        </Link>
      </div>
    </>
  );
}