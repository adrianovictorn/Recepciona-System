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

  // Função para buscar atendimentos finalizados/desistências
  function fetchAtendimentosFinalizados() {
    fetch('/api/paciente/finalizados')
      .then(response => response.json())
      .then(atendimentos => {
        const tabelaFinalizados = document.getElementById('tabela-finalizados');
        const tbodyFinalizados = tabelaFinalizados.querySelector('tbody');
        const tabelaDesistencias = document.getElementById('tabela-desistencias');
        const tbodyDesistencias = tabelaDesistencias.querySelector('tbody');

        tbodyFinalizados.innerHTML = '';
        tbodyDesistencias.innerHTML = '';

        atendimentos.forEach(a => {
          const tr = document.createElement('tr');
          tr.classList.add(`estado-${a.estado}`);
          const horarioEntrada = new Date(a.horarioEntrada).toLocaleString();
          const horarioSaida = a.horarioSaida ? new Date(a.horarioSaida).toLocaleString() : '-';
          tr.innerHTML = `
            <td>${a.id}</td>
            <td>${a.nome}</td>
            <td>${horarioEntrada}</td>
            <td>${horarioSaida}</td>
            <td>${setoresMap[a.setor] || '-'}</td>
            <td>${a.estado}</td>
          `;
          if(a.estado === 'FINALIZADO'){
            tbodyFinalizados.appendChild(tr);
          } else if(a.estado === 'DESISTENCIA'){
            tbodyDesistencias.appendChild(tr);
          }
        });
      })
      .catch(error => {
        console.error('Erro ao buscar atendimentos finalizados/desistências:', error);
      });
  }

  // Carregar atendimentos ao carregar a página
  fetchAtendimentosFinalizados();
});
