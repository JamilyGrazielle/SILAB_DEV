package com.ifma.silab.dto.reserva;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservaCadastroDTO {

    @NotNull(message = "É preciso informar qual laboratório quer reservar.")
    private Long laboratorioId;

    @NotNull(message = "Informe que data você quer reservar.")
    private LocalDate data;

    @NotNull(message = "Informe a hora inicial da reserva.")
    private LocalTime horaInicio;

    @NotNull(message = "Informe a hora final da reserva.")
    private LocalTime horaFim;

    private String motivo;

    private boolean recorrente = false;

    private LocalDate dataFimRecorrencia;

}
