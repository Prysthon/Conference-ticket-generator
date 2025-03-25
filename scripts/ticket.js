document.addEventListener("DOMContentLoaded", function() {
  // Recupera os dados armazenados no localStorage
  const userName = localStorage.getItem("userName") || "Guest";
  const userEmail = localStorage.getItem("userEmail") || "guest@example.com";
  const userGitHub = localStorage.getItem("userGitHub") || "@guest";
  const userAvatar = localStorage.getItem("userAvatar") || "";

  // Exibe a mensagem de congratulações com o nome do usuário
  const congratsText = document.getElementById("congratsText");
  congratsText.textContent = `Congrats, ${userName}! Your ticket is ready.`;

  // Exibe a mensagem de email com destaque para o endereço
  const emailText = document.getElementById("emailText");
  emailText.innerHTML = `We've emailed your ticket to <span class="highlight-email">${userEmail}</span> and will send updates in the run up to the event.`;

  // Preenche os dados do ticket com as informações do usuário
  document.getElementById("userNameText").textContent = userName;
  document.getElementById("userGitHubText").textContent = userGitHub;
  
  // Exibe a imagem de avatar, se existir; caso contrário, usa um ícone padrão
  const avatarImg = document.getElementById("avatarImg");
  avatarImg.src = userAvatar ? userAvatar : "./assets/images/icon-upload.svg";

  // Atualiza a data do evento com a data de hoje e o local "Salvador, BA"
  const conferenceDateEl = document.getElementById("conferenceDate");
  const today = new Date();
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  conferenceDateEl.textContent = `${formattedDate} | Salvador, BA`;

  // Função para gerar um código de ingresso aleatório (6 caracteres alfanuméricos com hash inicial)
  function generateTicketCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return '#' + code;
  }

  // Define o código do ingresso no elemento, exibido verticalmente
  document.getElementById("ticketCode").textContent = generateTicketCode();
});
