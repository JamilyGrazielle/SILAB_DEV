package com.ifma.silab.service.exceptions;

public class UsuarioSenhasDiferentesException extends RuntimeException {

    public UsuarioSenhasDiferentesException(String mensagem) {
        super(mensagem);
    }
}
