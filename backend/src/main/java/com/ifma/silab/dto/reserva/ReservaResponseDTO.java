package com.ifma.silab.dto.reserva;

import com.ifma.silab.model.enums.StatusReserva;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReservaResponseDTO(Long id, String nomeProfessor, String nomeLaboratorio, LocalDate data, LocalTime horaInicio, LocalTime horaFim, StatusReserva status, LocalDateTime dataSolicitacao) {
}
