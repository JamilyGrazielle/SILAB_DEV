package com.ifma.silab.repository;

import com.ifma.silab.model.SolicitacaoCadastro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitacaoCadastroRepository extends JpaRepository<SolicitacaoCadastro, Long> {
    boolean existsByEmail(String email);
    boolean existsByMatricula(String matricula);
}
