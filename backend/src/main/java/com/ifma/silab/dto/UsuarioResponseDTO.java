package com.ifma.silab.dto;

import com.ifma.silab.model.enums.Perfil;
import com.ifma.silab.model.enums.Status;

public record UsuarioResponseDTO(Long id, String nome, String matricula, String email, Perfil perfil, Status status) {
}
