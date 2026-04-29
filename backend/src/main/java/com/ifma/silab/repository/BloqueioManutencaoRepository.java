package com.ifma.silab.repository;

import com.ifma.silab.model.BloqueioManutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BloqueioManutencaoRepository extends JpaRepository<BloqueioManutencao, Long> {

}
