package com.ifma.silab.controller;

import com.ifma.silab.dto.auth.CadastroDTO;
import com.ifma.silab.service.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cadastro")
public class CadastroController {

    @Autowired
    private SolicitacaoService service;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<String> solicitarCadastro(@RequestBody @Valid CadastroDTO dto) {
        service.solicitarCadastro(dto);

        return ResponseEntity.ok("Solicitação enviada com sucesso! Aguarde aprovação do administrador.");
    }
}
