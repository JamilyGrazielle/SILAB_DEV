package com.ifma.silab.service.exceptions;

public class LaboratorioNomeJaCadastrado extends RuntimeException {

    public LaboratorioNomeJaCadastrado(String mensagem) {
        super(mensagem);
    }
}
