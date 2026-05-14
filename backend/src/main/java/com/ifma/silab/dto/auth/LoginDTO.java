package com.ifma.silab.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {

    @NotBlank(message = "A matrícula é obrigatória.")
    private String matricula;

    @NotBlank(message = "A senha é obrigatória.")
    private String senha;
}
