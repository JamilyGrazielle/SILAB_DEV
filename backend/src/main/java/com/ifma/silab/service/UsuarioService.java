package com.ifma.silab.service;

import com.ifma.silab.dto.UsuarioResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ifma.silab.repository.UsuarioRepository;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;


    public List<UsuarioResponseDTO> listarTodos() {
        return repository.findAll()
                .stream().map(u -> new UsuarioResponseDTO(u.getId(), u.getNome(), u.getMatricula(), u.getEmail(), u.getPerfil(), u.getStatus())).toList();
    }



}
