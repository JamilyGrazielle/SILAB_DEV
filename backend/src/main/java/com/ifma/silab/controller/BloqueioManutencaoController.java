package com.ifma.silab.controller;

import com.ifma.silab.dto.bloqueioManutencao.BloqueioManutencaoDTO;
import com.ifma.silab.dto.bloqueioManutencao.BloqueioManutencaoResponseDTO;
import com.ifma.silab.service.BloqueioManutencaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bloqueios")
public class BloqueioManutencaoController {

    @Autowired
    private BloqueioManutencaoService bloqueioManutencaoService;

    @GetMapping
    public ResponseEntity<List<BloqueioManutencaoResponseDTO>> listarBloqueios() {
        List<BloqueioManutencaoResponseDTO> bloqueios = bloqueioManutencaoService.listarBloqueios();
        return ResponseEntity.ok().body(bloqueios);
    }

    @PostMapping
    public ResponseEntity<String> criarBloqueio(@RequestBody @Valid BloqueioManutencaoDTO dto) {
        bloqueioManutencaoService.criarBloqueio(dto);
        return ResponseEntity.ok().body("Bloqueio criado com sucesso.");
    }

    @PatchMapping("/{id}/encerrar")
    public ResponseEntity<String> encerrarBloqueio(@PathVariable Long id) {
        bloqueioManutencaoService.encerrarBloqueio(id);
        return ResponseEntity.ok().body("Manutenção encerrada.");
    }
}
