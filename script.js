// Aguarda o carregamento completo do DOM para iniciar a execução dos scripts
document.addEventListener("DOMContentLoaded", function () {
  const avatarInput = document.getElementById("avatar");
  const uploadBox = document.querySelector(".upload-box");
  const infoContainer = document.querySelector(".info-container");
  const infoText = infoContainer.querySelector("span");
  const infoIcon = infoContainer.querySelector("img");
  const form = document.querySelector(".form-container");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const githubInput = document.getElementById("github");

  let uploadedImage = null;

  // Permite abertura do seletor de arquivos ao pressionar Enter ou Espaço na upload-box
  uploadBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      avatarInput.click();
    }
  });

  // Tratamento da seleção do arquivo para upload do avatar
  avatarInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    // Verifica o formato permitido (JPG ou PNG)
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      showError("Invalid image format! Only JPG or PNG allowed.");
      return;
    }

    // Verifica se o tamanho do arquivo não excede 500KB
    if (file.size > 500 * 1024) {
      showError("Image too large! Max size is 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImage = e.target.result;
      displayImage(uploadedImage);
    };
    reader.readAsDataURL(file);
  });

  /**
   * Exibe a imagem carregada na upload-box e mostra os botões de ação.
   * @param {string} imageSrc - Fonte da imagem (DataURL) a ser exibida.
   */
  function displayImage(imageSrc) {
    uploadBox.innerHTML = `
      <img src="${imageSrc}" width="100" style="border-radius: 50%;" alt="Uploaded Image">
      <div class="action-buttons">
        <button type="button" id="removeImage">Remove</button>
        <button type="button" id="changeImage">Change</button>
      </div>
    `;

    // Adiciona eventos para os botões "Remover" e "Alterar"
    document.getElementById("removeImage").addEventListener("click", removeImage);
    document.getElementById("changeImage").addEventListener("click", () => avatarInput.click());

    // Oculta a mensagem de upload após a imagem ser exibida
    infoContainer.style.display = "none";
  }

  /**
   * Remove a imagem carregada e restaura o estado inicial da upload-box.
   */
  function removeImage() {
    uploadedImage = null;
    uploadBox.innerHTML = `
      <img src="./assets/images/icon-upload.svg" width="40" alt="Upload Icon">
      <span>Drag and drop or click to upload</span>
      <input type="file" accept=".jpg,.jpeg,.png" id="avatar" aria-labelledby="label-avatar">
    `;
    // Reanexa o listener para o novo input de arquivo
    const newAvatarInput = document.getElementById("avatar");
    newAvatarInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 500 * 1024) {
        showError("Image too large! Max size is 500KB.");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        showError("Formato de imagem inválido! Apenas JPG ou PNG são permitidos.");
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedImage = e.target.result;
        displayImage(uploadedImage);
      };
      reader.readAsDataURL(file);
    });
    // Exibe novamente a mensagem de upload após remover a imagem
    infoContainer.style.display = "flex";
  }

  /**
   * Exibe uma mensagem de erro na info-container.
   * @param {string} message - Mensagem de erro a ser exibida.
   */
  function showError(message) {
    infoContainer.style.display = "flex";
    infoText.textContent = message;
    infoText.style.color = "red";
    infoIcon.src = "./assets/images/icon-error.svg";
  }

  /**
   * Valida os campos do formulário e exibe mensagens de erro, se necessário.
   * Se todos os campos forem válidos, os dados são armazenados e o usuário é redirecionado.
   * @param {Event} event - Evento de submissão do formulário.
   */
  function validateForm(event) {
    event.preventDefault();

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const githubValue = githubInput.value.trim();
    let valid = true;

    // Remove mensagens de erro anteriores
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    // Remove atributo aria-invalid dos campos para limpar estados anteriores
    [avatarInput, nameInput, emailInput, githubInput].forEach(inp => {
      inp.removeAttribute("aria-invalid");
    });

    // Validação do upload de imagem
    if (!uploadedImage) {
      showFieldError(uploadBox, "Image is required!");
      valid = false;
    }

    // Validação do campo nome
    if (nameValue.length < 3) {
      showFieldError(nameInput, "O nome deve ter pelo menos 3 caracteres.");
      valid = false;
    }

    // Validação do campo email
    if (!validateEmail(emailValue)) {
      showFieldError(emailInput, "Invalid email format.");
      valid = false;
    }

    // Validação do campo GitHub username
    if (githubValue === "") {
      showFieldError(githubInput, "O username do GitHub é obrigatório.");
      valid = false;
    }

    if (valid) {
      // Armazena os dados no localStorage para uso na página do ticket
      localStorage.setItem("userName", nameValue);
      localStorage.setItem("userEmail", emailValue);
      localStorage.setItem("userGitHub", githubValue);
      localStorage.setItem("userAvatar", uploadedImage || "");

      // Redireciona para a página do ticket
      window.location.href = "ticket.html";
    }
  }

  /**
   * Exibe uma mensagem de erro para um campo específico do formulário.
   * @param {HTMLElement} inputOrBox - Elemento de input ou caixa de upload.
   * @param {string} message - Mensagem de erro a ser exibida.
   */
  function showFieldError(inputOrBox, message) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.setAttribute("role", "alert"); // para screen readers
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "0.85rem";
    errorDiv.style.marginTop = "5px";
    errorDiv.innerHTML = `
      <img src="./assets/images/icon-info.svg" width="12" style="margin-right: 5px;">
      ${message}
    `;

    // Se o elemento for um input, adiciona atributo aria-invalid
    if (inputOrBox.tagName === "INPUT") {
      inputOrBox.setAttribute("aria-invalid", "true");
      inputOrBox.parentNode.appendChild(errorDiv);
    } else {
      // Caso seja a upload-box
      inputOrBox.appendChild(errorDiv);
    }
  }

  /**
   * Valida o formato do email utilizando expressão regular.
   * @param {string} email - Email a ser validado.
   * @returns {boolean} - Retorna true se o email for válido, senão false.
   */
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  // Associa a validação do formulário ao evento de submit
  form.addEventListener("submit", validateForm);
});
