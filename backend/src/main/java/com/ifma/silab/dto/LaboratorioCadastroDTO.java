package com.ifma.silab.dto;

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
    @NotNull(message = "A capacidade é obrigatória.")
    Integer capacidade;

    List<EquipamentoDTO> equipamentos = new ArrayList<>();;
}
