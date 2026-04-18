package com.ifma.silab.config;

import com.ifma.silab.model.Usuario;
import com.ifma.silab.model.enums.Perfil;
import com.ifma.silab.model.enums.Status;
import com.ifma.silab.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Arrays;

@Configuration
public class TesteConfig implements CommandLineRunner {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {

        usuarioRepository.deleteAll();

        String senhaAdmin = passwordEncoder.encode("senha123");
        String senhaProfessor = passwordEncoder.encode("senha456");

        Usuario u1 = new Usuario(null, "Admin", "12345", "admin@email.com", senhaAdmin, Perfil.ROOT, Status.ATIVO);
        Usuario u2 = new Usuario(null, "Professor", "54321", "prof@email.com", senhaProfessor, Perfil.PROFESSOR, Status.ATIVO);

        usuarioRepository.saveAll(Arrays.asList(u1, u2));
    }
}
