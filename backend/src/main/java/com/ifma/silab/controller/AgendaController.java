package com.ifma.silab.controller;

import com.ifma.silab.dto.reserva.AgendaResponseDTO;
import com.ifma.silab.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/agenda")
public class AgendaController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public ResponseEntity<AgendaResponseDTO> consultarAgenda(@RequestParam Long LaboratorioId, @RequestParam LocalDate semana) {
        return ResponseEntity.ok().body(reservaService.consultarAgenda(LaboratorioId, semana));
    }
}
