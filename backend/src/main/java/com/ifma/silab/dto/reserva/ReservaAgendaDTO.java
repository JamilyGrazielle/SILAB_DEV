package com.ifma.silab.dto.reserva;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaAgendaDTO(LocalDate data, LocalTime horaInicio, LocalTime horaFim, String nomeProfessor, String nomeLaboratorio, String motivo) {}
