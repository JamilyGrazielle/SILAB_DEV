package com.ifma.silab.service;

import com.ifma.silab.dto.UsuarioCadastroDTO;
import com.ifma.silab.model.Usuario;
import com.ifma.silab.model.enums.Perfil;
import com.ifma.silab.model.enums.Status;
import com.ifma.silab.service.exceptions.UsuarioEmailJaSolicitadoException;
import com.ifma.silab.service.exceptions.UsuarioMatriculaJaSolicitadaException;
import com.ifma.silab.service.exceptions.UsuarioSenhasDiferentesException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.ifma.silab.repository.UsuarioRepository;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public void solicitarCadastro(UsuarioCadastroDTO dto) {

        if (repository.existsByMatricula(dto.getMatricula())) {
            throw new UsuarioMatriculaJaSolicitadaException("Matrícula já cadastrada ou possui solicitação pendente");
        }

        if (repository.existsByEmail(dto.getEmail())) {
            throw new UsuarioEmailJaSolicitadoException("E-mail já cadastrado ou possui solicitação pendente");
        }

        if (!dto.getSenha().equals(dto.getConfirmaSenha())) {
            throw new UsuarioSenhasDiferentesException("As senhas não coincidem!");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setId(null);
        novoUsuario.setNome(dto.getNome());
        novoUsuario.setMatricula(dto.getMatricula());
        novoUsuario.setEmail(dto.getEmail());
        novoUsuario.setSenha(bCryptPasswordEncoder.encode(dto.getSenha()));
        novoUsuario.setPerfil(Perfil.PROFESSOR);
        novoUsuario.setStatus(Status.PENDENTE);

        repository.save(novoUsuario);
    }

}
