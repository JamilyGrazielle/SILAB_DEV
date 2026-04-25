package com.ifma.silab.service;

import com.ifma.silab.dto.reserva.ReservaCadastroDTO;
import com.ifma.silab.dto.reserva.ReservaResponseDTO;
import com.ifma.silab.model.Laboratorio;
import com.ifma.silab.model.Reserva;
import com.ifma.silab.model.Usuario;
import com.ifma.silab.model.enums.Perfil;
import com.ifma.silab.model.enums.StatusLaboratorio;
import com.ifma.silab.model.enums.StatusReserva;
import com.ifma.silab.repository.LaboratorioRepository;
import com.ifma.silab.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private LaboratorioRepository laboratorioRepository;

    public List<ReservaResponseDTO> listarTodas() {
        return reservaRepository.findAll()
                .stream()
                .map(r -> new ReservaResponseDTO(
                        r.getId(),
                        r.getProfessor().getNome(),
                        r.getLaboratorio().getNome(),
                        r.getData(),
                        r.getHoraInicio(),
                        r.getHoraFim(),
                        r.getStatus(),
                        r.getDataSolicitacao()))
                .toList();
    }

    public List<ReservaResponseDTO> listarMinhasReservas(Usuario professor) {
        return reservaRepository.findByProfessor(professor)
                .stream()
                .map(r -> new ReservaResponseDTO(
                        r.getId(),
                        r.getProfessor().getNome(),
                        r.getLaboratorio().getNome(),
                        r.getData(),
                        r.getHoraInicio(),
                        r.getHoraFim(),
                        r.getStatus(),
                        r.getDataSolicitacao()))
                .toList();
    }

    public void criarReserva(Usuario professor, ReservaCadastroDTO dto) {
        Laboratorio laboratorio = laboratorioRepository.findById(dto.getLaboratorioId()).orElseThrow(() -> new RuntimeException("Laboratório não encontrado."));

        if (laboratorio.getStatus() == StatusLaboratorio.EM_MANUTENCAO) {
            throw new RuntimeException("O laboratório está em manutenção.");
        }

        boolean conflito = reservaRepository.existsConflito(
                dto.getLaboratorioId(),
                dto.getData(),
                dto.getHoraInicio(),
                dto.getHoraFim()
        );

        if (conflito) {
            throw new RuntimeException("Laboratório já reservado neste horário.");
        }

        if (dto.getHoraFim().isBefore(dto.getHoraInicio())) {
            throw new RuntimeException("Hora final da reserva não pode ser anterior à hora inicial.");
        }

        Reserva reserva = new Reserva();
        reserva.setProfessor(professor);
        reserva.setLaboratorio(laboratorio);
        reserva.setData(dto.getData());
        reserva.setHoraInicio(dto.getHoraInicio());
        reserva.setHoraFim(dto.getHoraFim());
        reserva.setStatus(StatusReserva.CONFIRMADA);

        reservaRepository.save(reserva);
    }

    public void cancelarReserva(Long reservaId, Usuario usuario) {
        Reserva reserva = reservaRepository.findById(reservaId).orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        //Verifica se a reserva pertence ao professor inserido, e não a outro professor.
        boolean isProfessor = reserva.getProfessor().getId().equals(usuario.getId());
        boolean isAdmin = usuario.getPerfil() == Perfil.ADMIN || usuario.getPerfil() == Perfil.ROOT;

        if (!isProfessor && !isAdmin) {
            throw new RuntimeException("Você não tem permissão para cancelar esta reserva.");
        }

        if (reserva.getStatus() == StatusReserva.CANCELADA) {
            throw new RuntimeException("Reserva já cancelada");
        }

        reserva.setStatus(StatusReserva.CANCELADA);
        reservaRepository.save(reserva);
    }

}
