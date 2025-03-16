package github.io.adrianovictorn.sistema_controle_de_acesso.dto;

import java.time.LocalDateTime;

import github.io.adrianovictorn.sistema_controle_de_acesso.entity.enums.Estado;
import github.io.adrianovictorn.sistema_controle_de_acesso.entity.enums.Setor;

public record CreatePacienteDTO(
    String nome,
    LocalDateTime horarioEntrada,
    Estado estado,
    Setor setor
) {
    
}
