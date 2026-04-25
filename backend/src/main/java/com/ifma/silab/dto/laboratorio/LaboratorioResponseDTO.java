package com.ifma.silab.dto.laboratorio;

import com.ifma.silab.dto.equipamento.EquipamentoDTO;
import com.ifma.silab.model.enums.StatusLaboratorio;

import java.util.List;

public record LaboratorioResponseDTO(Long id, String nome, Integer capacidade, StatusLaboratorio status, List<EquipamentoDTO> equipamentos) {
}
