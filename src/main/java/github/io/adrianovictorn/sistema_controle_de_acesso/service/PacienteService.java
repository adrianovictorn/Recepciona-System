package github.io.adrianovictorn.sistema_controle_de_acesso.service;


import java.util.List;

import org.springframework.stereotype.Service;

import github.io.adrianovictorn.sistema_controle_de_acesso.dto.CreatePacienteDTO;
import github.io.adrianovictorn.sistema_controle_de_acesso.dto.ListPacienteDTO;
import github.io.adrianovictorn.sistema_controle_de_acesso.dto.UpdatePacienteDTO;
import github.io.adrianovictorn.sistema_controle_de_acesso.dto.ViewPacienteDTO;
import github.io.adrianovictorn.sistema_controle_de_acesso.entity.Paciente;
import github.io.adrianovictorn.sistema_controle_de_acesso.entity.enums.Estado;
import github.io.adrianovictorn.sistema_controle_de_acesso.repository.PacienteRepository;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    
    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }
    
    public ViewPacienteDTO criarAtendimento(CreatePacienteDTO createPacienteDTO) {
        Paciente paciente = new Paciente();
        paciente.setNome(createPacienteDTO.nome());
        paciente.setHorarioEntrada(createPacienteDTO.horarioEntrada());
        paciente.setEstado(Estado.AGUARDANDO);
        
        pacienteRepository.save(paciente);

        ViewPacienteDTO pacienteDto = ViewPacienteDTO.fromEntity(paciente);
        return pacienteDto;
    }

    public List<ListPacienteDTO> listarAtendimentos() {
        return pacienteRepository.findAll().stream().map(ListPacienteDTO::fromEntity).toList();
    }

    public ViewPacienteDTO atualizarAtendimento (Long id, UpdatePacienteDTO updatePacienteDTO){
        Paciente paciente = pacienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        paciente.setHorarioSaida(updatePacienteDTO.horarioDesaida());
        paciente.setEstado(updatePacienteDTO.estado());

        pacienteRepository.save(paciente);
        ViewPacienteDTO pacienteDTO = ViewPacienteDTO.fromEntity(paciente);
        return pacienteDTO;
    }


}
