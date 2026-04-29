package com.ifma.silab.dto.reserva;

import java.time.LocalDate;
import java.util.List;

public record AgendaResponseDTO(LocalDate incioSemana, LocalDate fimSemana, List<ReservaAgendaDTO> reservas) {}
