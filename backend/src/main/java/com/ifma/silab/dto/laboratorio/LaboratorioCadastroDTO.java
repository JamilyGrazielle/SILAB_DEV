package com.ifma.silab.dto.laboratorio;

import com.ifma.silab.dto.equipamento.EquipamentoDTO;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class LaboratorioCadastroDTO {

    @NotBlank(message = "O nome é obrigatório.")
    String nome;

    @Min(1)
    @NotNull(message = "Informe a capacidade do laboratório.")
    Integer capacidade;

    List<EquipamentoDTO> equipamentos = new ArrayList<>();;
}
