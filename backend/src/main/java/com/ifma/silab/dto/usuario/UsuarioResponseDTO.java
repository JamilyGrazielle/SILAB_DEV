package com.ifma.silab.dto.usuario;

import com.ifma.silab.model.enums.Perfil;
import com.ifma.silab.model.enums.StatusUsuario;

public record UsuarioResponseDTO(Long id, String nome, String matricula, String email, Perfil perfil, StatusUsuario status) {
}
