package com.ifma.silab.service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UsuarioEmailJaSolicitadoException extends RuntimeException {

    public UsuarioEmailJaSolicitadoException(String mensagem) {
        super(mensagem);
    }
}
