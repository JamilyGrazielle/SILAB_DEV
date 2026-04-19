package com.ifma.silab.dto;

import java.time.LocalDateTime;

public record StandardErrorDTO(
        LocalDateTime timestamp,
        Integer status,
        String error,
        String message,
        String path
) {}
