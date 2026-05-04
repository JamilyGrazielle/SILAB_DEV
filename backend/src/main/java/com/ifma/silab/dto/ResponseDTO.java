package com.ifma.silab.dto;

import com.ifma.silab.model.enums.Perfil;

public record ResponseDTO(String nome, String token, Perfil perfil) {
}
