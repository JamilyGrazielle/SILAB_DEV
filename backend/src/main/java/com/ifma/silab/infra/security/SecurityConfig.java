package com.ifma.silab.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    req.requestMatchers(HttpMethod.POST, "/api/login").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/api/cadastro").permitAll();
                    req.requestMatchers(HttpMethod.GET, "/api/agenda").permitAll();

                    req.requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/status").hasAnyRole("ADMIN", "ROOT");
                    req.requestMatchers(HttpMethod.GET, "/api/usuarios").hasAnyRole("ADMIN", "ROOT");
                    req.requestMatchers(HttpMethod.POST, "/api/usuarios").hasAnyRole("ADMIN", "ROOT");

                    req.requestMatchers(HttpMethod.GET, "/api/solicitacoes/**").hasAnyRole("ADMIN", "ROOT");
                    req.requestMatchers(HttpMethod.PATCH, "/api/solicitacoes/**").hasAnyRole("ADMIN", "ROOT");

                    req.requestMatchers(HttpMethod.GET, "/api/laboratorios/**").hasAnyRole("ADMIN", "ROOT", "PROFESSOR");
                    req.requestMatchers(HttpMethod.POST, "/api/laboratorios/**").hasAnyRole("ADMIN", "ROOT");
                    req.requestMatchers(HttpMethod.PUT, "/api/laboratorios/**").hasAnyRole("ADMIN", "ROOT");
                    req.requestMatchers(HttpMethod.PATCH, "/api/laboratorios/**").hasAnyRole("ADMIN", "ROOT");
                    req.requestMatchers(HttpMethod.DELETE, "/api/laboratorios/**").hasAnyRole("ADMIN", "ROOT");

                    req.requestMatchers(HttpMethod.GET, "/api/reservas").hasAnyRole("ADMIN", "ROOT");
                    req.requestMatchers(HttpMethod.GET, "/api/reservas/minhas").hasRole("PROFESSOR");
                    req.requestMatchers(HttpMethod.POST, "/api/reservas").hasRole("PROFESSOR");
                    req.requestMatchers(HttpMethod.PATCH, "/api/reservas/*/cancelar").hasAnyRole("PROFESSOR", "ADMIN", "ROOT");

                    req.requestMatchers("/api/bloqueios/**").hasAnyRole("ADMIN", "ROOT");

                    req.requestMatchers("/error").permitAll();
                    req.anyRequest().authenticated();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();

    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
