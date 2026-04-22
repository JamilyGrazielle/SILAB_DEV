package com.ifma.silab.service;

import com.ifma.silab.dto.CadastroDTO;
import com.ifma.silab.dto.SolicitacaoResponseDTO;
import com.ifma.silab.model.SolicitacaoCadastro;
import com.ifma.silab.model.Usuario;
import com.ifma.silab.model.enums.Status;
import com.ifma.silab.model.enums.StatusSolicitacao;
import com.ifma.silab.repository.SolicitacaoCadastroRepository;
import com.ifma.silab.repository.UsuarioRepository;
import com.ifma.silab.service.exceptions.UsuarioEmailJaSolicitadoException;
import com.ifma.silab.service.exceptions.UsuarioMatriculaJaSolicitadaException;
import com.ifma.silab.service.exceptions.UsuarioSenhasDiferentesException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitacaoService {

    @Autowired
    SolicitacaoCadastroRepository solicitacaoCadastroRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public List<SolicitacaoResponseDTO> listarSolicitacoes() {
        return solicitacaoCadastroRepository.findAll()
                .stream().map(s -> new SolicitacaoResponseDTO(s.getId(), s.getNome(), s.getMatricula(), s.getEmail(), s.getStatus(), s.getDataSolicitacao(), s.getDataResposta())).toList();
    }

    public SolicitacaoResponseDTO encontrarSolicitacaoPorId(Long id) {
        Optional<SolicitacaoCadastro> solicitacao = solicitacaoCadastroRepository.findById(id);
        solicitacao.orElseThrow(() -> new RuntimeException("Solicitação não encontrada."));
        return new SolicitacaoResponseDTO(
                solicitacao.get().getId(),
                solicitacao.get().getNome(),
                solicitacao.get().getMatricula(),
                solicitacao.get().getEmail(),
                solicitacao.get().getStatus(),
                solicitacao.get().getDataSolicitacao(),
                solicitacao.get().getDataResposta()
        );
    }

    public void solicitarCadastro(CadastroDTO dto) {

        if (usuarioRepository.existsByMatricula(dto.getMatricula())) {
            throw new UsuarioMatriculaJaSolicitadaException("Matrícula já cadastrada");
        }

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new UsuarioEmailJaSolicitadoException("E-mail já cadastrado");
        }

        if (solicitacaoCadastroRepository.existsByMatricula(dto.getMatricula())) {
            throw new UsuarioMatriculaJaSolicitadaException("Essa matrícula já está com solicitação pendente.");
        }

        if (solicitacaoCadastroRepository.existsByEmail(dto.getEmail())) {
            throw new UsuarioMatriculaJaSolicitadaException("Esse e-mail já está com solicitação pendente.");
        }

        if (!dto.getSenha().equals(dto.getConfirmaSenha())) {
            throw new UsuarioSenhasDiferentesException("As senhas não coincidem!");
        }

        SolicitacaoCadastro solicitacao = new SolicitacaoCadastro();
        solicitacao.setNome(dto.getNome());
        solicitacao.setMatricula(dto.getMatricula());
        solicitacao.setEmail(dto.getEmail());
        solicitacao.setSenha(bCryptPasswordEncoder.encode(dto.getSenha()));

        solicitacaoCadastroRepository.save(solicitacao);
    }

    public void aprovaSolicitacao(Long id) {
        SolicitacaoCadastro solicitacao = solicitacaoCadastroRepository.findById(id).orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new RuntimeException("Solicitação já foi respondida");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setId(null);
        novoUsuario.setNome(solicitacao.getNome());
        novoUsuario.setMatricula(solicitacao.getMatricula());
        novoUsuario.setEmail(solicitacao.getEmail());
        novoUsuario.setSenha(solicitacao.getSenha());
        novoUsuario.setPerfil(solicitacao.getPerfil());
        novoUsuario.setStatus(Status.ATIVO);

        usuarioRepository.save(novoUsuario);

        solicitacao.setStatus(StatusSolicitacao.APROVADA);
        solicitacao.setDataResposta(LocalDateTime.now());
        solicitacaoCadastroRepository.save(solicitacao);
    }

    public void rejeitaSolicitacao(Long id) {
        SolicitacaoCadastro solicitacao = solicitacaoCadastroRepository.findById(id).orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new RuntimeException("Solicitação já foi respondida");
        }

        solicitacao.setStatus(StatusSolicitacao.REJEITADA);
        solicitacao.setDataResposta(LocalDateTime.now());
        solicitacaoCadastroRepository.save(solicitacao);
    }
}
