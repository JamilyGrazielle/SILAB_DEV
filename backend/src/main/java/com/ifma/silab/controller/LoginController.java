package com.ifma.silab.controller;

import com.ifma.silab.dto.auth.LoginDTO;
import com.ifma.silab.dto.ResponseDTO;
import com.ifma.silab.infra.security.TokenService;
import com.ifma.silab.model.Usuario;
import com.ifma.silab.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity efetuarLogin(@RequestBody @Valid LoginDTO dados) {

        var authToken = new UsernamePasswordAuthenticationToken(dados.getMatricula(), dados.getSenha());
        var auth = manager.authenticate(authToken);

        Usuario usuario = usuarioRepository.findByMatricula(dados.getMatricula())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        var token = tokenService.generateToken(usuario);
        return ResponseEntity.ok(new ResponseDTO(usuario.getNome(), token));
    }
}
