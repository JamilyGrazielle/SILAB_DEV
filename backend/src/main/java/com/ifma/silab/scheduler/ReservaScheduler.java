package com.ifma.silab.scheduler;

import com.ifma.silab.model.Reserva;
import com.ifma.silab.model.enums.StatusReserva;
import com.ifma.silab.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class ReservaScheduler {

    @Autowired
    private ReservaRepository reservaRepository;

    @Scheduled(fixedRate = 60000)
    public void concluirReservasPassadas() {
        List<Reserva> reservas = reservaRepository.findReservasParaConcluir(LocalDate.now(), LocalTime.now());

        reservas.forEach(r -> r.setStatus(StatusReserva.CONCLUIDA));
        reservaRepository.saveAll(reservas);
    }
}
