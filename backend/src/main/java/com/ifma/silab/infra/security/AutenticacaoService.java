package com.ifma.silab.infra.security;

import com.ifma.silab.model.Usuario;
import com.ifma.silab.model.enums.Status;
import com.ifma.silab.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


@Component
public class AutenticacaoService implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String matricula) throws UsernameNotFoundException {
        Usuario usuario = repository.findByMatricula(matricula)
                .orElseThrow(() -> new UsernameNotFoundException("Matrícula ou senha incorretas"));

        return User.builder()
                .username(usuario.getMatricula())
                .password(usuario.getSenha())
                .roles(usuario.getPerfil().name())
                .disabled(usuario.getStatus() == Status.PENDENTE)
                .accountLocked(usuario.getStatus() == Status.INATIVO)
                .build();
    }
}
