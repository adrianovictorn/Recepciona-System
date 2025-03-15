document.addEventListener('DOMContentLoaded', function() {

  const formAtendimento = document.getElementById('form-atendimento');
  if(formAtendimento) {
    formAtendimento.addEventListener('submit', function(e) {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const horarioEntrada = document.getElementById('horarioEntrada').value;
      
      const novoAtendimento = { nome, horarioEntrada };

      fetch('/api/paciente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAtendimento)
      })
      .then(response => {
        if(response.ok) return response.json();
        throw new Error('Erro ao cadastrar atendimento');
      })
      .then(data => {
        document.getElementById('msg-cadastro').innerText = 'Atendimento cadastrado com sucesso!';
        formAtendimento.reset();
      })
      .catch(error => {
        console.error(error);
        document.getElementById('msg-cadastro').innerText = 'Falha no cadastro.';
      });
    });
  }

  // ----------------------------
  // Função para buscar atendimentos (para as páginas de consulta)
  // ----------------------------
  function fetchAtendimentos() {
    return fetch('/api/paciente')
      .then(response => response.json())
      .catch(error => {
        console.error('Erro ao buscar atendimentos:', error);
        return [];
      });
  }

  // ----------------------------
  // Carregar atendimentos abertos (estado AGUARDANDO)
  // ----------------------------
  if(document.getElementById('tabela-abertos')) {
    fetchAtendimentos().then(atendimentos => {
      const tbody = document.querySelector('#tabela-abertos tbody');
      tbody.innerHTML = '';
      const abertos = atendimentos.filter(a => a.estado === 'AGUARDANDO');
      abertos.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${a.id}</td>
          <td>${a.nome}</td>
          <td>${a.horarioEntrada}</td>
          <td>
            <button onclick="finalizarAtendimento(${a.id}, 'Finalizado')">Finalizar</button>
            <button onclick="finalizarAtendimento(${a.id}, 'Desistência')">Desistir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // ----------------------------
  // Carregar atendimentos finalizados ou com desistência (estado diferente de AGUARDANDO)
  // ----------------------------
  if(document.getElementById('tabela-finalizados')) {
    fetchAtendimentos().then(atendimentos => {
      const tbody = document.querySelector('#tabela-finalizados tbody');
      tbody.innerHTML = '';
      const finalizados = atendimentos.filter(a => a.estado !== 'AGUARDANDO');
      finalizados.forEach(a => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${a.id}</td>
          <td>${a.nome}</td>
          <td>${a.horarioEntrada}</td>
          <td>${a.horarioSaida || '-'}</td>
          <td>${a.estado}</td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // ----------------------------
  // Função para finalizar atendimento ou registrar desistência
  // ----------------------------

  const estadosValidos = {
    "Aguardando": "AGUARDANDO",
    "Em Atendimento": "EM_ATENDIMENTO",
    "Desistência": "DESISTENCIA",
    "Finalizado": "FINALIZADO"
  };

  window.finalizarAtendimento = function(id, novoEstado) {
    // Obtendo a data e hora atual no formato correto
    const now = new Date();
    const data = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];
    const horarioDesaida = now.toISOString().replace('Z', '');
    // Criando o objeto com os dados a serem atualizados
    const update = { horarioDesaida: horarioDesaida, estado: estadosValidos[novoEstado] || novoEstado};

    fetch(`/api/paciente/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('Erro ao atualizar atendimento');
    })
    .then(() => {
        // Verifica se a tabela de abertos ou finalizados está presente e recarrega
        if (document.getElementById('tabela-abertos') || document.getElementById('tabela-finalizados')) {
            location.reload();
        }
    })
    .catch(error => {
        console.error(error);
        alert('Erro ao atualizar atendimento. Verifique o console para mais detalhes.');
    });
};
});
