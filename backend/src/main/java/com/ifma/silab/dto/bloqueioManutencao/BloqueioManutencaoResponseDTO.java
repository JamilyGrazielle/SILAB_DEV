package com.ifma.silab.dto.bloqueioManutencao;

import java.time.LocalDateTime;

public record BloqueioManutencaoResponseDTO(Long id, String nomeLaboratorio, LocalDateTime dataInicio, LocalDateTime dataFim, String motivo, Boolean ativo) {}
