package com.ifma.silab.repository;

import com.ifma.silab.model.Usuario;
import com.ifma.silab.model.enums.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmail(String email);
    boolean existsByMatricula(String matricula);
    Optional<Usuario> findByMatricula(String matricula);
    List<Usuario> findByPerfil(Perfil perfil);

}
