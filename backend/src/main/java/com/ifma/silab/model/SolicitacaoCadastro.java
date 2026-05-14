package com.ifma.silab.model;

import com.ifma.silab.model.enums.Perfil;
import com.ifma.silab.model.enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "solicitacao")
public class SolicitacaoCadastro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao status = StatusSolicitacao.PENDENTE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil = Perfil.PROFESSOR;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDateTime dataSolicitacao = LocalDateTime.now();

    @Column(name = "data_resposta")
    private LocalDateTime dataResposta;

}
