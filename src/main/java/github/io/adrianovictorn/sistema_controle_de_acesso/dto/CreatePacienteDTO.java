package github.io.adrianovictorn.sistema_controle_de_acesso.dto;

import java.time.LocalDateTime;

import github.io.adrianovictorn.sistema_controle_de_acesso.entity.enums.Estado;

public record CreatePacienteDTO(
    String nome,
    LocalDateTime horarioEntrada,
    Estado estado
) {
    
}
