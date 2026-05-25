package com.ifma.silab.service;

import com.ifma.silab.dto.equipamento.EquipamentoDTO;
import com.ifma.silab.dto.laboratorio.LaboratorioCadastroDTO;
import com.ifma.silab.dto.laboratorio.LaboratorioResponseDTO;
import com.ifma.silab.model.Equipamento;
import com.ifma.silab.model.Laboratorio;
import com.ifma.silab.model.enums.StatusLaboratorio;
import com.ifma.silab.model.enums.StatusReserva;
import com.ifma.silab.repository.EquipamentoRepository;
import com.ifma.silab.repository.LaboratorioRepository;
import com.ifma.silab.repository.ReservaRepository;
import com.ifma.silab.service.exceptions.LaboratorioNomeJaCadastrado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaboratorioService {

    @Autowired
    LaboratorioRepository laboratorioRepository;

    @Autowired
    EquipamentoRepository equipamentoRepository;
    @Autowired
    private ReservaRepository reservaRepository;

    public List<LaboratorioResponseDTO> listarTodos() {
        return laboratorioRepository.findAll()
                .stream()
                .map(l -> new LaboratorioResponseDTO(
                        l.getId(),
                        l.getNome(),
                        l.getCapacidade(),
                        l.getStatus(),
                        l.getEquipamentos().stream().map(e -> new EquipamentoDTO(e.getId(), e.getNome(), e.getQuantidade())).toList()))
                .toList();
    }

    public LaboratorioResponseDTO buscarPorId(Long id) {
        Laboratorio laboratorio = laboratorioRepository.findById(id).orElseThrow(() -> new RuntimeException("Laboratório não encontrado."));

        return new LaboratorioResponseDTO(
            laboratorio.getId(),
            laboratorio.getNome(),
            laboratorio.getCapacidade(),
            laboratorio.getStatus(),
            laboratorio.getEquipamentos().stream().map(e -> new EquipamentoDTO(e.getId(), e.getNome(), e.getQuantidade())).toList());
    }

    public LaboratorioResponseDTO buscarPorNome(String nome) {
        Laboratorio laboratorio = laboratorioRepository.findByNomeContainingIgnoreCase(nome).orElseThrow(() -> new RuntimeException("Laboratório não encontrado."));

        return new LaboratorioResponseDTO(
                laboratorio.getId(),
                laboratorio.getNome(),
                laboratorio.getCapacidade(),
                laboratorio.getStatus(),
                laboratorio.getEquipamentos().stream().map(e -> new EquipamentoDTO(e.getId(), e.getNome(), e.getQuantidade())).toList());
    }

    public void cadastrarLaboratorio(LaboratorioCadastroDTO dto) {

        if (laboratorioRepository.existsByNomeIgnoreCase(dto.getNome())) {
            throw new LaboratorioNomeJaCadastrado("Nome do laboratório já cadastrado.");
        }

        Laboratorio laboratorio = new Laboratorio();
        laboratorio.setNome(dto.getNome());
        laboratorio.setCapacidade(dto.getCapacidade());
        laboratorio.setStatus(StatusLaboratorio.DISPONIVEL);

        List<Equipamento> equipamentos = dto.getEquipamentos().stream().map( e -> {
            Equipamento equipamento = new Equipamento();
            equipamento.setNome(e.nome());
            equipamento.setQuantidade(e.quantidade());
            equipamento.setLaboratorio(laboratorio);
            return equipamento;
        }).toList();

        laboratorio.setEquipamentos(equipamentos);
        laboratorioRepository.save(laboratorio);
    }

    public void removerLaboratorio(Long id) {
        Laboratorio laboratorio = laboratorioRepository.findById(id).orElseThrow(() -> new RuntimeException("Laboratório não encontrado"));

        boolean temReservasAtivas = reservaRepository.existsByLaboratorioIdAndStatus(id, StatusReserva.CONFIRMADA);

        if (temReservasAtivas) {
            throw new RuntimeException("Não é possivel deletar um laboratório com reservas ativas");
        }

        laboratorioRepository.delete(laboratorio);
    }

    public void atualizarLaboratorio(Long id, LaboratorioCadastroDTO dto) {
        Laboratorio laboratorio = laboratorioRepository.findById(id).orElseThrow(() -> new RuntimeException("Laboratório não encontrado"));

        if (laboratorioRepository.existsByNomeIgnoreCaseAndIdNot(dto.getNome(), id)) {
            throw new LaboratorioNomeJaCadastrado("Nome do laboratório já cadastrado.");
        }

        laboratorio.setNome(dto.getNome());
        laboratorio.setCapacidade(dto.getCapacidade());
        laboratorioRepository.save(laboratorio);
    }

    public void adicionarEquipamento(Long laboratorioId, EquipamentoDTO dto) {
        Laboratorio laboratorio = laboratorioRepository.findById(laboratorioId).orElseThrow(() -> new RuntimeException("Laboratório não encontrado"));

        boolean jaExiste = laboratorio.getEquipamentos().stream()
                .anyMatch(e -> e.getNome().equalsIgnoreCase(dto.nome()));

        if (jaExiste) {
            throw new RuntimeException("Equipamento já cadastrado neste laboratório.");
        }

        Equipamento equipamento = new Equipamento();
        equipamento.setLaboratorio(laboratorio);
        equipamento.setNome(dto.nome());
        equipamento.setQuantidade(dto.quantidade());

        laboratorio.getEquipamentos().add(equipamento);
        laboratorioRepository.save(laboratorio);
    }

    public void removerEquipamento(Long laboratorioId, Long equipamentoId) {
        Laboratorio laboratorio = laboratorioRepository.findById(laboratorioId).orElseThrow(() -> new RuntimeException("Laboratório não encontrado"));

        Equipamento equipamento = equipamentoRepository.findById(equipamentoId).orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));

        if (!equipamento.getLaboratorio().getId().equals(laboratorio.getId())) {
            throw new RuntimeException("Equipamento não pertence a este laboratorio.");
        }

        equipamentoRepository.delete(equipamento);
    }
}
