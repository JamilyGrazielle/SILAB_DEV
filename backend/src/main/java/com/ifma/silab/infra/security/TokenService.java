package com.ifma.silab.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.ifma.silab.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(Usuario usuario) {

        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("API SILab")
                    .withSubject(usuario.getMatricula())
                    .withExpiresAt(generateExpirationDate())
                    .sign(algoritmo);
        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro ao gerar token jwt", e);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer("API SILab")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
