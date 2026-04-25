package com.ifma.silab.dto;

import com.ifma.silab.model.enums.StatusLaboratorio;

import java.util.List;

public record LaboratorioResponseDTO(Long id, String nome, Integer capacidade, StatusLaboratorio status, List<EquipamentoDTO> equipamentos) {
}
