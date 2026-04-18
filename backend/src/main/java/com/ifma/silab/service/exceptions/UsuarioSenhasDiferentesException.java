package com.ifma.silab.service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UsuarioSenhasDiferentesException extends RuntimeException {

    public UsuarioSenhasDiferentesException(String mensagem) {
        super(mensagem);
    }
}
