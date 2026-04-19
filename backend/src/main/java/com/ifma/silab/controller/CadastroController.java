package com.ifma.silab.controller;

import com.ifma.silab.dto.UsuarioCadastroDTO;
import com.ifma.silab.service.UsuarioService;
import com.ifma.silab.service.exceptions.UsuarioEmailJaSolicitadoException;
import com.ifma.silab.service.exceptions.UsuarioSenhasDiferentesException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cadastro")
public class CadastroController {

    @Autowired
    private UsuarioService service;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<String> solicitarCadastro(@RequestBody @Valid UsuarioCadastroDTO usuario) {
        service.solicitarCadastro(usuario);

        return ResponseEntity.ok("Solicitação enviada com sucesso! Aguarde aprovação.");
    }
}
