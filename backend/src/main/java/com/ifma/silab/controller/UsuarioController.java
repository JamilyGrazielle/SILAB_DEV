package com.ifma.silab.controller;

import com.ifma.silab.dto.usuario.StatusUsuarioDTO;
import com.ifma.silab.dto.usuario.UsuarioCadastroDTO;
import com.ifma.silab.dto.usuario.UsuarioResponseDTO;
import com.ifma.silab.model.Usuario;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.ifma.silab.service.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<UsuarioResponseDTO>> listar(@AuthenticationPrincipal Usuario solicitante) {
        List<UsuarioResponseDTO> usuarios = usuarioService.listarTodos(solicitante);
        return ResponseEntity.ok(usuarios);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<String> alterarStatus(@PathVariable Long id,
                                              @RequestBody StatusUsuarioDTO dto,
                                              @AuthenticationPrincipal Usuario solicitante) {
        usuarioService.mudarStatus(id, dto.status(), solicitante);
        return ResponseEntity.ok("Status atualizado com sucesso.");
    }

    @PostMapping
    public ResponseEntity<String> cadastrarManualmente(@AuthenticationPrincipal Usuario solicitante, @RequestBody @Valid UsuarioCadastroDTO dto) {
        usuarioService.cadastrarManualmente(solicitante, dto);
        return ResponseEntity.ok("Cadastro feito com sucesso.");
    }
}
