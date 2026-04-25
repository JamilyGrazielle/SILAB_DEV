package com.ifma.silab.model;

import com.ifma.silab.model.enums.StatusReserva;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private Usuario professor;

    @ManyToOne
    @JoinColumn(name = "laboratorio_id", nullable = false)
    private Laboratorio laboratorio;

    @Column(nullable = false)
    private LocalDate data;

    @Column(name = "hora_inicio",nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fim",nullable = false)
    private LocalTime horaFim;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusReserva status;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDateTime dataSolicitacao = LocalDateTime.now();
}
