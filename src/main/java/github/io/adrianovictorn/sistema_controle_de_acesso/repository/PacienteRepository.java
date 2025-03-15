package github.io.adrianovictorn.sistema_controle_de_acesso.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import github.io.adrianovictorn.sistema_controle_de_acesso.entity.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

}
