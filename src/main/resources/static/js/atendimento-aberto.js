document.addEventListener('DOMContentLoaded', function() {
    const setoresMap = {
      'ATENCAO_BASICA': 'Atenção Básica',
      'SECRETARIA': 'Secretaria',
      'VISA': 'VISA',
      'VIEP': 'VIEP',
      'CPD': 'CPD',
      'ALMOXARIFADO_COMPRAS': 'Almoxarifado/Compras'
    };
  
    const estadosMap = {
      'AGUARDANDO': 'Aguardando',
      'EM_ATENDIMENTO': 'Em Atendimento',
      'FINALIZADO': 'Finalizado',
      'DESISTENCIA': 'Desistência'
    };
  
    // Função para criar um select com opções e definir a opção selecionada
    function criarSelect(id, mapObj, valorAtual) {
      const select = document.createElement('select');
      select.id = id;
      Object.keys(mapObj).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = mapObj[key];
        if (valorAtual === key) {
          option.selected = true;
        }
        select.appendChild(option);
      });
      return select;
    }
  
    // Função para formatar uma data usando o fuso horário do Brasil (São Paulo)
    function formatarDataBrasil(data) {
      return new Date(data).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    }
  
    // Função para obter a data/hora atual no formato ISO ajustado para o fuso de São Paulo
    function getBrazilISOString() {
      const now = new Date();
      // Usando Intl.DateTimeFormat para obter as partes da data no fuso de São Paulo
      const options = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const parts = new Intl.DateTimeFormat('pt-BR', options).formatToParts(now);
      let day, month, year, hour, minute, second;
      parts.forEach(part => {
        switch(part.type) {
          case 'day': day = part.value; break;
          case 'month': month = part.value; break;
          case 'year': year = part.value; break;
          case 'hour': hour = part.value; break;
          case 'minute': minute = part.value; break;
          case 'second': second = part.value; break;
        }
      });
      // Formata para ISO (sem fuso) pois o backend pode interpretar como LocalDateTime
      return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }
  
    // Função para buscar os atendimentos abertos
    function fetchAtendimentosAbertos() {
      fetch('/api/paciente/abertos')
        .then(response => response.json())
        .then(atendimentos => {
          const tabelaAbertos = document.getElementById('tabela-abertos');
          const tbody = tabelaAbertos.querySelector('tbody');
          tbody.innerHTML = ''; // Limpar tabela
  
          atendimentos.forEach(a => {
            const tr = document.createElement('tr');
  
            // Coluna ID
            const tdId = document.createElement('td');
            tdId.textContent = a.id;
            tr.appendChild(tdId);
            

  
            // Coluna Nome
            const tdNome = document.createElement('td');
            tdNome.textContent = a.nome;
            tr.appendChild(tdNome);
  
            // Coluna Horário Entrada (formata para horário do Brasil)
            const tdHorario = document.createElement('td');
            tdHorario.textContent = formatarDataBrasil(a.horarioEntrada);
            tr.appendChild(tdHorario);
  
            // Coluna Setor com select
            const tdSetor = document.createElement('td');
            const setorSelect = criarSelect(`setor-${a.id}`, setoresMap, a.setor);
            tdSetor.appendChild(setorSelect);
            tr.appendChild(tdSetor);
  
            // Coluna Estado com select
            const tdEstado = document.createElement('td');
            const estadoSelect = criarSelect(`estado-${a.id}`, estadosMap, a.estado);
            tdEstado.appendChild(estadoSelect);
            tr.appendChild(tdEstado);
  
            // Coluna Ações com botão de atualização
            const tdAcoes = document.createElement('td');
            const btnAtualizar = document.createElement('button');
            btnAtualizar.textContent = 'Atualizar';
            btnAtualizar.addEventListener('click', function() {
              atualizarAtendimento(a.id);
            });
            tdAcoes.appendChild(btnAtualizar);
            tr.appendChild(tdAcoes);
            tr.classList.add(`estado-${a.estado}`);
            tbody.appendChild(tr);
          });
        })
        .catch(error => {
          console.error('Erro ao buscar atendimentos abertos:', error);
        });
    }
  
    // Função para atualizar o atendimento, capturando os valores atuais dos selects
    window.atualizarAtendimento = function(id) {
      const setorSelect = document.getElementById(`setor-${id}`);
      const estadoSelect = document.getElementById(`estado-${id}`);
      
      const novoEstado = estadoSelect.value;
      // Se o estado for FINALIZADO ou DESISTÊNCIA, define o horário de saída para o momento atual no fuso Brasil
      const horarioDesaida = (novoEstado === 'FINALIZADO' || novoEstado === 'DESISTENCIA')
        ? getBrazilISOString()
        : null;
      
      const update = {
        horarioDesaida: horarioDesaida,
        setor: setorSelect.value,
        estado: novoEstado
      };
  
      fetch(`/api/paciente/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      })
      .then(response => response.json())
      .then(() => {
        fetchAtendimentosAbertos();  // Atualiza a lista
      })
      .catch(error => {
        console.error(error);
        alert('Erro ao atualizar atendimento.');
      });
    };
  
    // Carregar atendimentos abertos ao iniciar a página
    fetchAtendimentosAbertos();
  });
  