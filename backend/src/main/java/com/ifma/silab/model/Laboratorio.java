package com.ifma.silab.model;

import com.ifma.silab.model.enums.StatusLaboratorio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "laboratorio")
public class Laboratorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String nome;

    Integer capacidade;

    @Enumerated(EnumType.STRING)
    StatusLaboratorio status;

    @OneToMany(mappedBy = "laboratorio", cascade = CascadeType.ALL)
    List<Equipamento> equipamentos = new ArrayList<>();
}
