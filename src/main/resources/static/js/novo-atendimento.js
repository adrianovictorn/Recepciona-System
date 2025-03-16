document.addEventListener("DOMContentLoaded", function () {
    const nomeInput = document.getElementById("nome");
    const horarioEntradaInput = document.getElementById("horarioEntrada");
    const setorInput = document.getElementById("setor");
    const dataList = document.getElementById("nomesCadastrados");
    const formAtendimento = document.getElementById("form-atendimento");
    const msgCadastro = document.getElementById("msg-cadastro");
    let pacientesCadastrados = [];

    async function carregarPacientes() {
        try {
            const response = await fetch('/api/paciente');
            if (!response.ok) {
                throw new Error("Erro ao buscar pacientes");
            }
            const pacientes = await response.json();
            pacientesCadastrados = pacientes.map(p => p.nome);
            atualizarDataList();
        } catch (error) {
            console.error("Erro ao carregar nomes dos pacientes:", error);
        }
    }

    function atualizarDataList() {
        dataList.innerHTML = "";
        pacientesCadastrados.forEach((nome) => {
            const option = document.createElement("option");
            option.value = nome;
            dataList.appendChild(option);
        });
    }

    formAtendimento.addEventListener("submit", async function (event) {
        event.preventDefault();

        const pacienteData = {
            nome: nomeInput.value.trim(),
            horarioEntrada: horarioEntradaInput.value,
            setor: setorInput.value
        };

        try {
            const response = await fetch("http://localhost:8080/api/paciente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pacienteData)
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar atendimento");
            }

            const result = await response.json();
            msgCadastro.innerHTML = `<p style="color: green;">Atendimento cadastrado com sucesso! ID: ${result.id}</p>`;
            formAtendimento.reset();
            carregarPacientes();
        } catch (error) {
            console.error("Erro ao cadastrar atendimento:", error);
            msgCadastro.innerHTML = `<p style="color: red;">Erro ao cadastrar atendimento. Tente novamente.</p>`;
        }
    });

    carregarPacientes();
});
