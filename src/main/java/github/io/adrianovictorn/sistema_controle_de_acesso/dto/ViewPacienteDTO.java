package github.io.adrianovictorn.sistema_controle_de_acesso.dto;

import github.io.adrianovictorn.sistema_controle_de_acesso.entity.Paciente;

public record ViewPacienteDTO(

    Long id,
    String nome,
    String horarioEntrada,
    String horarioSaida

) {
    public static ViewPacienteDTO fromEntity(Paciente paciente) {
        return new ViewPacienteDTO(
            paciente.getId(),
            paciente.getNome(),
            paciente.getHorarioEntrada() != null ? paciente.getHorarioEntrada().toString() : "",
            paciente.getHorarioSaida() != null ? paciente.getHorarioSaida().toString() : ""
        );
    }
}
