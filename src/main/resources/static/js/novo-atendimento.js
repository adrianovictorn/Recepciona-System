document.addEventListener("DOMContentLoaded", function () {
    const nomeInput = document.getElementById("nome");
    const dataList = document.getElementById("nomesCadastrados");
    const formAtendimento = document.getElementById("form-atendimento");
    let pacientesCadastrados = [];
  
    // Função para popular o datalist a partir dos dados do backend
    async function carregarPacientes() {
      try {
        const response = await fetch("http://localhost:8080/api/paciente");
        if (!response.ok) {
          throw new Error("Erro ao buscar pacientes");
        }
        const pacientes = await response.json();
        // Extraindo apenas os nomes dos pacientes
        pacientesCadastrados = pacientes.map(p => p.nome);
        atualizarDataList();
      } catch (error) {
        console.error("Erro ao carregar nomes dos pacientes:", error);
      }
    }
  
    // Função para atualizar o conteúdo do datalist
    function atualizarDataList() {
      dataList.innerHTML = "";
      pacientesCadastrados.forEach((nome) => {
        const option = document.createElement("option");
        option.value = nome;
        dataList.appendChild(option);
      });
    }
  
    // Evento para filtrar as sugestões enquanto o usuário digita (opcional,
    // já que o datalist nativo do HTML já filtra automaticamente)
    nomeInput.addEventListener("input", function () {
      // Se desejar lógica customizada, pode ser adicionada aqui.
    });
  
    // Evento de envio do formulário
    formAtendimento.addEventListener("submit", function (event) {
      event.preventDefault();
      let nomePaciente = nomeInput.value.trim();
  
      // Se for um novo nome, adiciona à lista de pacientes cadastrados
      if (nomePaciente && !pacientesCadastrados.includes(nomePaciente)) {
        pacientesCadastrados.push(nomePaciente);
        atualizarDataList();
      }
  
      // Aqui, você pode fazer a chamada para cadastrar o atendimento via API,
      // por exemplo, utilizando fetch com método POST.
      alert(`Atendimento cadastrado para: ${nomePaciente}`);
      formAtendimento.reset();
    });
  
    // Carregar os pacientes ao iniciar
    carregarPacientes();
  });
  