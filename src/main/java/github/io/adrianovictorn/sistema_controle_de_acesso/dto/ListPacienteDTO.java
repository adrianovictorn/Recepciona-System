package github.io.adrianovictorn.sistema_controle_de_acesso.dto;


import github.io.adrianovictorn.sistema_controle_de_acesso.entity.Paciente;
import github.io.adrianovictorn.sistema_controle_de_acesso.entity.enums.Estado;

public record ListPacienteDTO(

    Long id,
    String nome,
    String horarioEntrada,
    String horarioSaida,
    Estado estado
) {
    
    public static ListPacienteDTO fromEntity(Paciente paciente) {
        return new ListPacienteDTO(
            paciente.getId(),
            paciente.getNome(),
            paciente.getHorarioEntrada() != null ? paciente.getHorarioEntrada().toString() : "",
            paciente.getHorarioSaida() != null ? paciente.getHorarioSaida().toString() : "",
            paciente.getEstado()
        );
    }
}
