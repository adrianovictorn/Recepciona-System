package github.io.adrianovictorn.sistema_controle_de_acesso.dto;

import java.time.LocalDateTime;

import github.io.adrianovictorn.sistema_controle_de_acesso.entity.enums.Estado;
import github.io.adrianovictorn.sistema_controle_de_acesso.entity.enums.Setor;

public record UpdatePacienteDTO(
    LocalDateTime horarioDesaida,
    Estado estado,
    Setor setor
) {
    

}
