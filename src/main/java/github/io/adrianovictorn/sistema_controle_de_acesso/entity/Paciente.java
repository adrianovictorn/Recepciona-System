package github.io.adrianovictorn.sistema_controle_de_acesso.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import github.io.adrianovictorn.sistema_controle_de_acesso.entity.enums.Estado;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "paciente")
public class Paciente {
    

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "nome", length = 100, nullable = false)
    private String nome;

    @CreationTimestamp
    private LocalDateTime horarioEntrada;
    
    
    private LocalDateTime horarioSaida;

    @Enumerated(EnumType.STRING)
    private Estado estado;


}
