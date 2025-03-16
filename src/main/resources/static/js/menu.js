document.addEventListener("DOMContentLoaded", function () {
    // Lógica do menu hamburger
    const header = document.querySelector(".cabecalho");
    if (!document.querySelector(".hamburger")) {
      const hamburger = document.createElement("div");
      hamburger.classList.add("hamburger");
      hamburger.innerHTML = "&#9776;"; // Ícone de hamburger
      header.appendChild(hamburger);
  
      hamburger.addEventListener("click", function () {
        document.querySelector(".menu-vertical").classList.toggle("active");
      });
    }
  
    // Lógica para transformar a tabela em blocos (cards) em telas pequenas
    const tabela = document.getElementById("tabela-dados");
    if (tabela) {
      const tbody = tabela.querySelector("tbody");
      const linhas = Array.from(tbody.querySelectorAll("tr"));
      const container = document.createElement("div");
      container.id = "tabelas-em-bloco";
  
      linhas.forEach(function (linha) {
        const cells = Array.from(linha.children);
        let card = document.createElement("div");
        card.classList.add("table-card");
  
        // Cabeçalho do card (utiliza a primeira célula, por exemplo, o nome ou ID)
        let headerCard = document.createElement("div");
        headerCard.classList.add("table-card-header");
        headerCard.textContent = cells[0].textContent;
        card.appendChild(headerCard);
  
        // Conteúdo do card com as demais informações
        let content = document.createElement("div");
        content.classList.add("table-card-content");
        cells.forEach(function (cell, idx) {
          if (idx !== 0) {
            let p = document.createElement("p");
            p.textContent = cell.textContent;
            content.appendChild(p);
          }
        });
        card.appendChild(content);
  
        // Toggle do conteúdo ao clicar no card
        card.addEventListener("click", function () {
          content.style.display = content.style.display === "block" ? "none" : "block";
        });
  
        container.appendChild(card);
      });
  
      // Insere o container de cards após a tabela
      tabela.parentNode.insertBefore(container, tabela.nextSibling);
    }
  });
  