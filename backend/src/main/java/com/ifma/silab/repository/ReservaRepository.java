package com.ifma.silab.repository;

import com.ifma.silab.model.Reserva;
import com.ifma.silab.model.Usuario;
import com.ifma.silab.model.enums.StatusReserva;
import com.ifma.silab.model.enums.StatusUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByProfessor(Usuario professor);
    List<Reserva> findByProfessorAndStatus(Usuario professor, StatusReserva status);

    @Query("""
        SELECT COUNT(r) > 0 FROM Reserva r
        WHERE r.laboratorio.id = :laboratorioId
        AND r.data = :data
        AND r.status != 'CANCELADA'
        AND r.horaInicio < :horaFim
        AND r.horaFim > :horaInicio
    """)
    boolean existsConflito(
            @Param("laboratorioId") Long laboratorioId,
            @Param("data") LocalDate data,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFim") LocalTime horaFim
    );
}
