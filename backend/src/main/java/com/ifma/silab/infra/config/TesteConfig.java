package com.ifma.silab.infra.config;

import com.ifma.silab.model.*;
import com.ifma.silab.model.enums.*;
import com.ifma.silab.repository.LaboratorioRepository;
import com.ifma.silab.repository.ReservaRepository;
import com.ifma.silab.repository.SolicitacaoCadastroRepository;
import com.ifma.silab.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
@Profile("test")
public class  TesteConfig implements CommandLineRunner {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SolicitacaoCadastroRepository solicitacaoCadastroRepository;

    @Autowired
    private LaboratorioRepository laboratorioRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    public void run(String... args) throws Exception {

        usuarioRepository.deleteAll();
        solicitacaoCadastroRepository.deleteAll();
        laboratorioRepository.deleteAll();
        reservaRepository.deleteAll();

        String senhaRoot = passwordEncoder.encode("senhaRoot");

        String senhaAdmin1 = passwordEncoder.encode("senhaAdm1");
        String senhaAdmin2 = passwordEncoder.encode("senhaAdm2");

        String senhaProfessor1 = passwordEncoder.encode("senhaProf1");
        String senhaProfessor2 = passwordEncoder.encode("senhaProf2");

        String senhaProfessor3 = passwordEncoder.encode("senhaProf3");
        String senhaProfessor4 = passwordEncoder.encode("senhaProf4");

        Usuario u1 = new Usuario(null, "Root", "matRoot", "root@email.com", senhaRoot, Perfil.ROOT, StatusUsuario.ATIVO);

        Usuario u2 = new Usuario(null, "Admin1", "matAdm1", "admin1@email.com", senhaAdmin1, Perfil.ADMIN, StatusUsuario.ATIVO);
        Usuario u3 = new Usuario(null, "Admin2", "matAdm2", "admin2@email.com", senhaAdmin2, Perfil.ADMIN, StatusUsuario.INATIVO);

        Usuario u4 = new Usuario(null, "Professor1", "matProf1", "prof1@email.com", senhaProfessor1, Perfil.PROFESSOR, StatusUsuario.ATIVO);
        Usuario u5 = new Usuario(null, "Professor2", "matProf2", "prof2@email.com", senhaProfessor2, Perfil.PROFESSOR, StatusUsuario.INATIVO);

        SolicitacaoCadastro s1 = new SolicitacaoCadastro(null, "Professor3", "matProf3", "prof3@gmail.com", senhaProfessor3, StatusSolicitacao.PENDENTE , Perfil.PROFESSOR, LocalDateTime.now(), null);
        SolicitacaoCadastro s2 = new SolicitacaoCadastro(null, "Professor4", "matProf4", "prof4@gmail.com", senhaProfessor4, StatusSolicitacao.PENDENTE , Perfil.PROFESSOR, LocalDateTime.now(), null);

        Equipamento e1 = new Equipamento(null, "Computador", 20, null);
        Equipamento e2 = new Equipamento(null, "Projetor", 1, null);
        Equipamento e3 = new Equipamento(null, "Televisão", 2, null);

        Equipamento e4 = new Equipamento(null, "Computador", 15, null);
        Equipamento e5 = new Equipamento(null, "Impressora 3d", 2, null);

        Laboratorio l1 = new Laboratorio(null, "Laboratorio 1", 30, StatusLaboratorio.DISPONIVEL, new ArrayList<>(List.of(e1,e2,e3)));
        Laboratorio l2 = new Laboratorio(null, "Laboratorio 2", 20, StatusLaboratorio.EM_MANUTENCAO, new ArrayList<>(List.of(e4,e5)));

        Reserva r1 = new Reserva(null, u4, l1, LocalDate.of(2026, 5, 10), LocalTime.of(8, 0), LocalTime.of(10, 0),"Aula de Programação 1", StatusReserva.CONFIRMADA, LocalDateTime.now());
        Reserva r2 = new Reserva(null, u4, l2, LocalDate.of(2026, 5, 10), LocalTime.of(10, 0), LocalTime.of(12, 0), "Aula de Programação 1", StatusReserva.CONFIRMADA, LocalDateTime.now());
        Reserva r3 = new Reserva(null, u5, l1, LocalDate.of(2026, 5, 11), LocalTime.of(14, 0), LocalTime.of(16, 0), "Aula de Porgramação 2", StatusReserva.CONFIRMADA, LocalDateTime.now());
        Reserva r4 = new Reserva(null, u5, l2, LocalDate.of(2026, 5, 11), LocalTime.of(16, 0), LocalTime.of(18, 0), "Aula de Programação 2" ,StatusReserva.CANCELADA, LocalDateTime.now());
        Reserva r5 = new Reserva(null, u4, l1, LocalDate.of(2026,4,28),LocalTime.of(10, 0), LocalTime.of(12, 0),"Aula de Porgramação Orientada a Objetos", StatusReserva.CONCLUIDA, LocalDateTime.now());
        e1.setLaboratorio(l1);
        e2.setLaboratorio(l1);
        e3.setLaboratorio(l1);
        e4.setLaboratorio(l2);
        e5.setLaboratorio(l2);

        usuarioRepository.saveAll(Arrays.asList(u1, u2, u3, u4, u5));
        solicitacaoCadastroRepository.saveAll(Arrays.asList(s1, s2));
        laboratorioRepository.saveAll(Arrays.asList(l1, l2));
        reservaRepository.saveAll(Arrays.asList(r1, r2, r3, r4, r5));
    }
}
