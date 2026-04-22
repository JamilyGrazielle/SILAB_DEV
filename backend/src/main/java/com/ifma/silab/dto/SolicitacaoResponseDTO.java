package com.ifma.silab.dto;

import com.ifma.silab.model.enums.StatusSolicitacao;

import java.time.LocalDateTime;

public record SolicitacaoResponseDTO(Long id, String nome, String matricula, String email, StatusSolicitacao status, LocalDateTime dataSolicitacao, LocalDateTime dataResposta) {}
