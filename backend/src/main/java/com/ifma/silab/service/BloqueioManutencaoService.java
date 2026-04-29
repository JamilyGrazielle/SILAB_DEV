package com.ifma.silab.service;

import com.ifma.silab.dto.bloqueioManutencao.BloqueioManutencaoDTO;
import com.ifma.silab.dto.bloqueioManutencao.BloqueioManutencaoResponseDTO;
import com.ifma.silab.model.BloqueioManutencao;
import com.ifma.silab.model.Laboratorio;
import com.ifma.silab.model.Reserva;
import com.ifma.silab.model.enums.StatusLaboratorio;
import com.ifma.silab.model.enums.StatusReserva;
import com.ifma.silab.repository.BloqueioManutencaoRepository;
import com.ifma.silab.repository.LaboratorioRepository;
import com.ifma.silab.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BloqueioManutencaoService {

    @Autowired
    private BloqueioManutencaoRepository bloqueioRepository;

    @Autowired
    private LaboratorioRepository laboratorioRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    public void criarBloqueio(BloqueioManutencaoDTO dto) {
        Laboratorio laboratorio = laboratorioRepository.findById(dto.getLaboratorioId()).orElseThrow(() -> new RuntimeException("Laboratório não encontrado"));

        if (dto.getDataFim().isBefore(dto.getDataInicio())) {
            throw new RuntimeException("Data fim não pode ser anterior à data início");
        }

        long diasBloqueio = ChronoUnit.DAYS.between(dto.getDataInicio(), dto.getDataFim());

        if (diasBloqueio > 30) {
            throw new RuntimeException("O bloqueio para manutenção de laboratório não pode passar de 30 dias");
        }

        BloqueioManutencao bloqueio = new BloqueioManutencao();
        bloqueio.setLaboratorio(laboratorio);
        bloqueio.setDataInicio(dto.getDataInicio());
        bloqueio.setDataFim(dto.getDataFim());
        bloqueio.setMotivo(dto.getMotivo());
        bloqueioRepository.save(bloqueio);

        laboratorio.setStatus(StatusLaboratorio.EM_MANUTENCAO);
        laboratorioRepository.save(laboratorio);

        List<Reserva> reservasConflitantes = reservaRepository.findReservasConflitantes(
                laboratorio,
                dto.getDataInicio().toLocalDate(),
                dto.getDataFim().toLocalDate()
        );

        reservasConflitantes.forEach(r -> r.setStatus(StatusReserva.CANCELADA));
        reservaRepository.saveAll(reservasConflitantes);
    }

    public void encerrarBloqueio(Long id) {
        BloqueioManutencao bloqueio = bloqueioRepository.findById(id).orElseThrow(() -> new RuntimeException("Bloqueio não encontrado"));

        if (!bloqueio.isAtivo()) {
            throw new RuntimeException("Bloqueio já encerrado");
        }

        bloqueio.setAtivo(false);
        bloqueioRepository.save(bloqueio);

        bloqueio.getLaboratorio().setStatus(StatusLaboratorio.DISPONIVEL);
        laboratorioRepository.save(bloqueio.getLaboratorio());
    }

    public List<BloqueioManutencaoResponseDTO> listarBloqueios() {
        return bloqueioRepository.findAll()
                .stream()
                .map(b -> new BloqueioManutencaoResponseDTO(
                        b.getId(),
                        b.getLaboratorio().getNome(),
                        b.getDataInicio(),
                        b.getDataFim(),
                        b.getMotivo(),
                        b.isAtivo()
                ))
                .toList();
    }
}
