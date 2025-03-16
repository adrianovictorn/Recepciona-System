document.addEventListener('DOMContentLoaded', function() {

  // Mapeamento entre o valor do enum no backend e o nome legível no frontend
  const setoresMap = {
    'ATENCAO_BASICA': 'Atenção Básica',
    'SECRETARIA': 'Secretaria',
    'VISA': 'VISA',
    'VIEP': 'VIEP',
    'CPD': 'CPD',
    'ALMOXARIFADO_COMPRAS': 'Almoxarifado/Compras'
  };

  // Populando a lista de setores no formulário
  const setorSelect = document.getElementById('setor');
  Object.keys(setoresMap).forEach(key => {
    const option = document.createElement('option');
    option.value = key;  // O valor é o valor do enum no backend
    option.textContent = setoresMap[key];  // O texto é o nome legível
    setorSelect.appendChild(option);
  });

  const formAtendimento = document.getElementById('form-atendimento');
  if(formAtendimento) {
    formAtendimento.addEventListener('submit', function(e) {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const horarioEntrada = document.getElementById('horarioEntrada').value;
      const setor = document.getElementById('setor').value; // O valor que será enviado para o backend

      const novoAtendimento = { nome, horarioEntrada, setor };

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

  function fetchAtendimentos() {
    console.log('Buscando atendimentos...');  // Para verificar se a função está sendo chamada
  
    fetch('/api/paciente')
      .then(response => {
        console.log(response);  // Verificar o objeto de resposta
        if (response.ok) return response.json();
        throw new Error('Erro ao buscar atendimentos');
      })
      .then(atendimentos => {
        console.log(atendimentos);  // Verificar os dados retornados
  
        const tabelaAbertos = document.getElementById('tabela-abertos');
        const tbody = tabelaAbertos.querySelector('tbody');
        tbody.innerHTML = '';  // Limpar tabela antes de adicionar novos dados
  
        atendimentos.forEach(a => {
          const tr = document.createElement('tr');
          const horarioEntrada = new Date(a.horarioEntrada).toLocaleString();
          tr.innerHTML = `
            <td>${a.id}</td>
            <td>${a.nome}</td>
            <td>${horarioEntrada}</td>
            <td>${setoresMap[a.setor] || '-'}</td>
            <td>
              <button onclick="finalizarAtendimento(${a.id}, 'Finalizado')">Finalizar</button>
              <button onclick="finalizarAtendimento(${a.id}, 'Desistência')">Desistir</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(error => {
        console.error('Erro ao buscar atendimentos:', error);
      });
  }
  

  // Carregar atendimentos abertos (estado AGUARDANDO)
  const tabelaAbertos = document.getElementById('tabela-abertos');
  if(tabelaAbertos) {
    fetchAtendimentos().then(atendimentos => {
      const tbody = tabelaAbertos.querySelector('tbody');
      tbody.innerHTML = '';
      const abertos = atendimentos.filter(a => a.estado === 'AGUARDANDO');
      abertos.forEach(a => {
        const tr = document.createElement('tr');
        const horarioEntrada = new Date(a.horarioEntrada).toLocaleString(); // Data legível
        tr.innerHTML = `
          <td>${a.id}</td>
          <td>${a.nome}</td>
          <td>${horarioEntrada}</td> <!-- Data formatada -->
          <td>${setoresMap[a.setor] || '-'}</td> <!-- Exibindo o nome legível do setor -->
          <td>
            <button onclick="finalizarAtendimento(${a.id}, 'Finalizado')">Finalizar</button>
            <button onclick="finalizarAtendimento(${a.id}, 'Desistência')">Desistir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // Carregar atendimentos finalizados ou com desistência (estado diferente de AGUARDANDO)
  const tabelaFinalizados = document.getElementById('tabela-finalizados');
  if(tabelaFinalizados) {
    fetchAtendimentos().then(atendimentos => {
      const tbody = tabelaFinalizados.querySelector('tbody');
      tbody.innerHTML = '';
      const finalizados = atendimentos.filter(a => a.estado !== 'AGUARDANDO');
      finalizados.forEach(a => {
        const tr = document.createElement('tr');
        const horarioEntrada = new Date(a.horarioEntrada).toLocaleString(); // Data legível
        const horarioSaida = a.horarioSaida ? new Date(a.horarioSaida).toLocaleString() : '-'; // Se não houver horário de saída, exibe '-'
        tr.innerHTML = `
          <td>${a.id}</td>
          <td>${a.nome}</td>
          <td>${horarioEntrada}</td> <!-- Data formatada -->
          <td>${horarioSaida}</td> <!-- Saída formatada -->
          <td>${a.estado}</td>
          <td>${setoresMap[a.setor] || '-'}</td> <!-- Exibindo o nome legível do setor -->
        `;
        tbody.appendChild(tr);
      });
    });
  }

  // Função para finalizar atendimento ou registrar desistência
  window.finalizarAtendimento = function(id, novoEstado) {
    const estadosValidos = {
      "Aguardando": "AGUARDANDO",
      "Em Atendimento": "EM_ATENDIMENTO",
      "Desistência": "DESISTENCIA",
      "Finalizado": "FINALIZADO"
    };

    const now = new Date();
    const horarioDesaida = now.toISOString();

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
