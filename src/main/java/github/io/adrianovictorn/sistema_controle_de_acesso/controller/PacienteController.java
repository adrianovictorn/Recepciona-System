package github.io.adrianovictorn.sistema_controle_de_acesso.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import github.io.adrianovictorn.sistema_controle_de_acesso.dto.CreatePacienteDTO;
import github.io.adrianovictorn.sistema_controle_de_acesso.dto.ListPacienteDTO;
import github.io.adrianovictorn.sistema_controle_de_acesso.dto.UpdatePacienteDTO;
import github.io.adrianovictorn.sistema_controle_de_acesso.dto.ViewPacienteDTO;
import github.io.adrianovictorn.sistema_controle_de_acesso.entity.enums.Estado;
import github.io.adrianovictorn.sistema_controle_de_acesso.service.PacienteService;

@RestController
@RequestMapping("/api/paciente")
public class PacienteController {
    
    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @PostMapping 
    public ResponseEntity<ViewPacienteDTO> cadastrarPaciente(@RequestBody CreatePacienteDTO pacienteDTO) {  
        ViewPacienteDTO novoPaciente = pacienteService.criarAtendimento(pacienteDTO);

        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()    
            .path("/{id}")           
            .buildAndExpand(novoPaciente.id()) 
            .toUri();          

        return ResponseEntity.created(location).body(novoPaciente);
    }

    @GetMapping
    public ResponseEntity<List<ListPacienteDTO>> listarPacientes() {
        return ResponseEntity.ok(pacienteService.listarAtendimentos());
    }

    

    @GetMapping("/finalizados")
    public ResponseEntity<List<ListPacienteDTO>> listarAtendimentosAberto() {
        List<ListPacienteDTO> abertos = pacienteService.listarAtendimentos().stream()
            .filter(dto -> dto.estado() == Estado.FINALIZADO || dto.estado() == Estado.DESISTENCIA)
            .toList();
        return ResponseEntity.ok(abertos);
    }   

  @GetMapping("/abertos")
    public ResponseEntity<List<ListPacienteDTO>> listarAtendimentosAbertos() {
        List<ListPacienteDTO> abertos = pacienteService.listarAtendimentos().stream()
            .filter(dto -> dto.estado() == Estado.AGUARDANDO || dto.estado() == Estado.EM_ATENDIMENTO)
            .toList();
        return ResponseEntity.ok(abertos);
    }


    @PutMapping("/{id}")
    public ResponseEntity<ViewPacienteDTO> atualizarPaciente(@PathVariable Long id, @RequestBody UpdatePacienteDTO pacienteDTO) {
        return ResponseEntity.ok(pacienteService.atualizarAtendimento(id, pacienteDTO));
    }
    
}
