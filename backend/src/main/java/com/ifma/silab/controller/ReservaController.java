package com.ifma.silab.controller;

import com.ifma.silab.dto.reserva.ReservaCadastroDTO;
import com.ifma.silab.dto.reserva.ReservaResponseDTO;
import com.ifma.silab.model.Usuario;
import com.ifma.silab.service.ReservaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> buscarTodasReservas() {
        List<ReservaResponseDTO> reservas = reservaService.listarTodas();
        return ResponseEntity.ok().body(reservas);
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<ReservaResponseDTO>> buscarTodasMinhasReservas(@AuthenticationPrincipal Usuario professor) {
        List<ReservaResponseDTO> minhasReservas = reservaService.listarMinhasReservas(professor);
        return ResponseEntity.ok().body(minhasReservas);
    }

    @PostMapping
    public ResponseEntity<String> criarReserva(@RequestBody @Valid ReservaCadastroDTO dto, @AuthenticationPrincipal Usuario professor) {
        reservaService.criarReserva(professor, dto);
        return ResponseEntity.ok().body("Reserva Cadastrada com sucesso.");
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<String> cancelarReserva(@PathVariable Long id, @AuthenticationPrincipal Usuario professor) {
        reservaService.cancelarReserva(id, professor);
        return ResponseEntity.ok().body("Reserva Cancelada com sucesso.");
    }
}
