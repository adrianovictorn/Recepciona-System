package github.io.adrianovictorn.sistema_controle_de_acesso.dto;

import java.time.LocalDateTime;

import github.io.adrianovictorn.sistema_controle_de_acesso.entity.enums.Estado;

public record UpdatePacienteDTO(
    String nome,
    LocalDateTime horarioDesaida,
    Estado estado
) {
    

}
