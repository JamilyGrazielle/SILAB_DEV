package com.ifma.silab.dto.bloqueioManutencao;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Valid
public class BloqueioManutencaoDTO {
    @NotNull
    private Long laboratorioId;

    @NotNull(message = "A data inicial é obrigatória.")
    private LocalDateTime dataInicio;

    @NotNull(message = "A data final é obrigatória.")
    private LocalDateTime dataFim;

    @NotBlank(message = "O motivo da manutenção é obrigatório.")
    private String motivo;
}
