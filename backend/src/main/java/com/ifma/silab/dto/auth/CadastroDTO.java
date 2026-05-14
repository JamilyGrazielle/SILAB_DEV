package com.ifma.silab.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CadastroDTO {

    @NotBlank(message = "O nome é obrigatório.")
    private String nome;

    @NotBlank(message = "A matrícula é obrigatória.")
    private String matricula;

    @Email(message = "O e-mail inválido.")
    private String email;

    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String senha;

    private String confirmaSenha;
}
