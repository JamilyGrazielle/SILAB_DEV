package com.ifma.silab.controller;

import com.ifma.silab.dto.equipamento.EquipamentoDTO;
import com.ifma.silab.dto.laboratorio.LaboratorioCadastroDTO;
import com.ifma.silab.dto.laboratorio.LaboratorioResponseDTO;
import com.ifma.silab.dto.laboratorio.StatusLaboratorioDTO;
import com.ifma.silab.service.LaboratorioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laboratorios")
public class LaboratorioController {

    @Autowired
    private LaboratorioService laboratorioService;

    @GetMapping
    public ResponseEntity<List<LaboratorioResponseDTO>> buscarTodos() {
        List<LaboratorioResponseDTO> laboratorio = laboratorioService.listarTodos();
        return ResponseEntity.ok().body(laboratorio);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LaboratorioResponseDTO> buscarPorId(@PathVariable Long id) {
        LaboratorioResponseDTO laboratorio = laboratorioService.buscarPorId(id);
        return ResponseEntity.ok().body(laboratorio);
    }

    @GetMapping("/buscar")
    public ResponseEntity<LaboratorioResponseDTO> buscarPorNome(@RequestParam String nome) {
        LaboratorioResponseDTO laboratorio = laboratorioService.buscarPorNome(nome);
        return ResponseEntity.ok().body(laboratorio);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<String> cadastrar(@RequestBody @Valid LaboratorioCadastroDTO dto) {
        laboratorioService.cadastrarLaboratorio(dto);
        return ResponseEntity.ok().body("Laboratório cadastrado com sucesso.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        laboratorioService.removerLaboratorio(id);
        return ResponseEntity.ok("Laboratório removido.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarLaboratorio(@PathVariable Long id, @RequestBody @Valid LaboratorioCadastroDTO dto) {
        laboratorioService.atualizarLaboratorio(id, dto);
        return ResponseEntity.ok("Laboratório atualizado");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<String> atualizarStatusLaboratorio(@PathVariable Long id, @RequestBody StatusLaboratorioDTO dto) {
        laboratorioService.atualizarStatusLaboratorio(id, dto);
        return ResponseEntity.ok("Status do laboratório atualizado");
    }

    @PostMapping("/{id}/equipamentos")
    public ResponseEntity<String> adicionarEquipamento(@PathVariable Long id, @RequestBody EquipamentoDTO dto) {
        laboratorioService.adicionarEquipamento(id,dto);
        return ResponseEntity.ok("Equipamento adicionado.");
    }

    @DeleteMapping("/{id}/equipamentos/{equipamentoId}")
    public ResponseEntity<String> deletarEquipamento(@PathVariable Long id, @PathVariable Long equipamentoId) {
        laboratorioService.removerEquipamento(id, equipamentoId);
        return ResponseEntity.ok("Equipamento deletado.");
    }

}
