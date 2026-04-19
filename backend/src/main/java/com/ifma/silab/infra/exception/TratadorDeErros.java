package com.ifma.silab.infra.exception;

import com.ifma.silab.dto.ErroValidacaoDTO;
import com.ifma.silab.dto.StandardErrorDTO;
import com.ifma.silab.service.exceptions.UsuarioEmailJaSolicitadoException;
import com.ifma.silab.service.exceptions.UsuarioMatriculaJaSolicitadaException;
import com.ifma.silab.service.exceptions.UsuarioSenhasDiferentesException;
import com.ifma.silab.service.exceptions.UsuarioStatusException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity tratarErro400(MethodArgumentNotValidException ex) {
        var erros = ex.getFieldErrors();
        return ResponseEntity.badRequest().body(erros.stream()
                .map(ErroValidacaoDTO::new).toList());
    }

    @ExceptionHandler({
            UsuarioSenhasDiferentesException.class,
            UsuarioMatriculaJaSolicitadaException.class,
            UsuarioEmailJaSolicitadoException.class,
            UsuarioStatusException.class
    })
    public ResponseEntity<StandardErrorDTO> tratarRegrasDeNegocio(RuntimeException ex, HttpServletRequest request) {
        StandardErrorDTO erro = new StandardErrorDTO(
                LocalDateTime.now(),
                400,
                "Regra de Negócio",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(400).body(erro);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<StandardErrorDTO> tratarErroAutenticacao(BadCredentialsException ex, HttpServletRequest request) {
        StandardErrorDTO erro = new StandardErrorDTO(
                LocalDateTime.now(),
                401,
                "Não Autorizado",
                "Matrícula ou senha incorretas.",
                request.getRequestURI()
        );
        return ResponseEntity.status(401).body(erro);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<StandardErrorDTO> tratarContaPendente(DisabledException ex, HttpServletRequest request) {
        StandardErrorDTO erro = new StandardErrorDTO(
                LocalDateTime.now(),
                403,
                "Acesso Negado",
                "Seu cadastro ainda não foi aprovado pelo administrador.",
                request.getRequestURI()
        );
        return ResponseEntity.status(403).body(erro);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<StandardErrorDTO> tratarContaInativa(LockedException ex, HttpServletRequest request) {
        StandardErrorDTO erro = new StandardErrorDTO(
                LocalDateTime.now(),
                403,
                "Acesso Negado",
                "Conta inativa.",
                request.getRequestURI()
        );
        return ResponseEntity.status(403).body(erro);
    }
}
