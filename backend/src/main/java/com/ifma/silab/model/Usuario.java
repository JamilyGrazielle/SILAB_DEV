package com.ifma.silab.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ifma.silab.model.enums.Perfil;
import com.ifma.silab.model.enums.StatusUsuario;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_completo", nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    private Perfil perfil;

    @Enumerated(EnumType.STRING)
    private StatusUsuario status;
}
