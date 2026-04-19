package com.ifma.silab.infra.config;

import com.ifma.silab.model.Usuario;
import com.ifma.silab.model.enums.Perfil;
import com.ifma.silab.model.enums.Status;
import com.ifma.silab.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Arrays;

@Configuration
@Profile("test")
public class TesteConfig implements CommandLineRunner {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {

        usuarioRepository.deleteAll();

        String senhaRoot = passwordEncoder.encode("senhaRoot");

        String senhaAdmin1 = passwordEncoder.encode("senhaAdm1");
        String senhaAdmin2 = passwordEncoder.encode("senhaAdm2");

        String senhaProfessor1 = passwordEncoder.encode("senhaProf1");
        String senhaProfessor2 = passwordEncoder.encode("senhaProf2");
        String senhaProfessor3 = passwordEncoder.encode("senhaProf3");

        Usuario u1 = new Usuario(null, "Root", "matRoot", "root@email.com", senhaRoot, Perfil.ROOT, Status.ATIVO);

        Usuario u2 = new Usuario(null, "Admin", "matAdm1", "admin@email.com", senhaAdmin1, Perfil.ADMINISTRADOR, Status.ATIVO);
        Usuario u3 = new Usuario(null, "Admin2", "matAdm2", "admin2@email.com", senhaAdmin2, Perfil.ADMINISTRADOR, Status.INATIVO);

        Usuario u4 = new Usuario(null, "Professor", "matProf1", "prof@email.com", senhaProfessor1, Perfil.PROFESSOR, Status.ATIVO);
        Usuario u5 = new Usuario(null, "Professor2", "matProf2", "prof2@email.com", senhaProfessor2, Perfil.PROFESSOR, Status.PENDENTE);
        Usuario u6 = new Usuario(null, "Professor3", "matProf3", "prof3@email.com", senhaProfessor3, Perfil.PROFESSOR, Status.INATIVO);

        usuarioRepository.saveAll(Arrays.asList(u1, u2, u3, u4, u5, u6));
    }
}
