package com.ifma.silab.service;

import com.ifma.silab.dto.usuario.UsuarioResponseDTO;
import com.ifma.silab.model.Reserva;
import com.ifma.silab.model.Usuario;
import com.ifma.silab.model.enums.Perfil;
import com.ifma.silab.model.enums.StatusReserva;
import com.ifma.silab.model.enums.StatusUsuario;
import com.ifma.silab.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ifma.silab.repository.UsuarioRepository;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private ReservaRepository reservaRepository;

    public List<UsuarioResponseDTO> listarTodos(Usuario solicitante) {

        if (solicitante.getPerfil() == Perfil.ROOT) {
            return repository.findAll()
                    .stream().map(u -> new UsuarioResponseDTO(u.getId(), u.getNome(), u.getMatricula(), u.getEmail(), u.getPerfil(), u.getStatus())).toList();
        }

        return repository.findByPerfil(Perfil.PROFESSOR)
                .stream().map(u -> new UsuarioResponseDTO(u.getId(), u.getNome(), u.getMatricula(), u.getEmail(), u.getPerfil(), u.getStatus())).toList();
    }

    public void mudarStatus(Long id, StatusUsuario novoStatus, Usuario solicitante) {
        Usuario alvo = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (solicitante.getPerfil() == Perfil.ADMIN && alvo.getPerfil() != Perfil.PROFESSOR) {
            throw new RuntimeException("Você só pode mudar o status do professor.");
        }

        if (solicitante.getPerfil() == Perfil.ROOT && alvo.getPerfil() == Perfil.ROOT) {
            throw new RuntimeException("Você não pode alterar status de outro ROOT");
        }

        alvo.setStatus(novoStatus);
        repository.save(alvo);

        if (novoStatus == StatusUsuario.INATIVO) {
            List<Reserva> reservas = reservaRepository.findByProfessorAndStatus(alvo, StatusReserva.CONFIRMADA);
            reservas.forEach(r -> r.setStatus(StatusReserva.CANCELADA));
            reservaRepository.saveAll(reservas);
        }
    }
}
