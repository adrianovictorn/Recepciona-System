document.addEventListener("DOMContentLoaded", function () {
    // Lógica do menu hamburger
    const hamburger = document.createElement("div");
    hamburger.classList.add("hamburger");
    hamburger.innerHTML = "&#9776;"; // Ícone de hamburger
    document.querySelector(".cabecalho").appendChild(hamburger);
  
    const menu = document.querySelector(".menu-vertical");
  
    hamburger.addEventListener("click", function () {
      menu.classList.toggle("active");
    });
  
    // Lógica para transformar a tabela em blocos em telas pequenas
    // Supondo que haja uma tabela com id "tabela-dados"
    const tabela = document.getElementById("tabela-dados");
    if (tabela) {
      const tbody = tabela.querySelector("tbody");
      const linhas = Array.from(tbody.querySelectorAll("tr"));
  
      const container = document.createElement("div");
      container.id = "tabelas-em-bloco";
  
      linhas.forEach(function (linha, index) {
        const cells = Array.from(linha.children);
        let card = document.createElement("div");
        card.classList.add("table-card");
  
        // Cabeçalho do card (pode ser o primeiro campo, como ID ou Nome)
        let header = document.createElement("div");
        header.classList.add("table-card-header");
        header.textContent = cells[0].textContent; // por exemplo, o ID ou Nome
        card.appendChild(header);
  
        // Conteúdo do card
        let content = document.createElement("div");
        content.classList.add("table-card-content");
        // Concatena as demais informações
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
  