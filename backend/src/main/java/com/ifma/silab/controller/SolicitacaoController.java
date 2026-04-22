package com.ifma.silab.controller;

import com.ifma.silab.dto.SolicitacaoResponseDTO;
import com.ifma.silab.service.SolicitacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    @Autowired
    SolicitacaoService solicitacaoService;

    @GetMapping
    public ResponseEntity<List<SolicitacaoResponseDTO>> findAll() {
        List<SolicitacaoResponseDTO> solicitacoes = solicitacaoService.listarSolicitacoes();
        return ResponseEntity.ok().body(solicitacoes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> findById(@PathVariable Long id) {
        SolicitacaoResponseDTO solicitacao = solicitacaoService.encontrarSolicitacaoPorId(id);
        return ResponseEntity.ok().body(solicitacao);
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<String> aprovar(@PathVariable Long id) {
        solicitacaoService.aprovaSolicitacao(id);
        return ResponseEntity.ok("Solicitação aprovada.");
    }

    @PatchMapping("/{id}/rejeitar")
    public ResponseEntity<String> rejeitar(@PathVariable Long id) {
        solicitacaoService.rejeitaSolicitacao(id);
        return ResponseEntity.ok("Solicitação rejeitada.");
    }
}
