let atividades = [];

let atividadeEditando = null;



const modal = document.getElementById("atividadeModal");

const btnNovaAtividade = document.getElementById("btnNovaAtividade");

const btnFecharModal = document.getElementById("btnFecharModal");

const atividadeForm = document.getElementById("atividadeForm");

const listaAtividades = document.getElementById("listaAtividades");

const modalTitulo = document.getElementById("modalTitulo");



if (btnNovaAtividade) {
  btnNovaAtividade.addEventListener("click", function () {
    atividadeEditando = null;

    modalTitulo.textContent = "Nova atividade";

    atividadeForm.reset();

    modal.style.display = "flex";
  });
}



if (btnFecharModal) {
  btnFecharModal.addEventListener("click", function () {
    modal.style.display = "none";

    atividadeForm.reset();

    atividadeEditando = null;
  });
}



if (atividadeForm) {
  atividadeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;

    const descricao = document.getElementById("descricao").value;

    const dataConclusao = document.getElementById("dataConclusao").value;

    

    if (atividadeEditando !== null) {
      atividades[atividadeEditando].titulo = titulo;

      atividades[atividadeEditando].descricao = descricao;

      atividades[atividadeEditando].dataConclusao = dataConclusao;
    }
    else {
      const novaAtividade = {
        id: Date.now(),

        titulo: titulo,

        descricao: descricao,

        dataCriacao: new Date().toISOString().split("T")[0],

        dataConclusao: dataConclusao,

        status: "aberta",
      };

      atividades.push(novaAtividade);
    }

    

    mostrarAtividades();

    

    modal.style.display = "none";

    atividadeForm.reset();

    atividadeEditando = null;
  });
}



function mostrarAtividades() {
  listaAtividades.innerHTML = "";

  

  if (atividades.length === 0) {
    listaAtividades.innerHTML = `
            <p class="message">
                Nenhuma atividade cadastrada.
            </p>
        `;

    return;
  }

  atividades.forEach(function (atividade, index) {
    const atrasada = verificarAtraso(atividade);

    const div = document.createElement("div");

    div.className = "atividade";

    if (atrasada) {
      div.classList.add("atrasada");
    }

    if (atividade.status === "concluida") {
      div.classList.add("concluida");
    }

    div.innerHTML = `

            <h3>
                ${atividade.titulo}
            </h3>

            <p>
                ${atividade.descricao}
            </p>

            <p>
                <strong>Data de criação:</strong>
                ${formatarData(atividade.dataCriacao)}
            </p>

            <p>
                <strong>Data de conclusão:</strong>
                ${formatarData(atividade.dataConclusao)}
            </p>

            <p class="status">
                <strong>Status:</strong>
                ${atividade.status === "concluida" ? "Concluída" : "Em aberto"}
            </p>

            ${
              atrasada
                ? `
                        <p class="atrasada-texto">
                            ⚠ ATIVIDADE ATRASADA
                        </p>
                    `
                : ""
            }

            <div class="atividade-acoes">

                <button
                    type="button"
                    class="btn"
                    onclick="editarAtividade(${index})"
                >
                    Editar
                </button>

                ${
                  atividade.status !== "concluida"
                    ? `
                            <button
                                type="button"
                                class="btn"
                                onclick="concluirAtividade(${index})"
                            >
                                Concluir
                            </button>
                        `
                    : ""
                }

                <button
                    type="button"
                    class="btn btn-secondary"
                    onclick="excluirAtividade(${index})"
                >
                    Excluir
                </button>

            </div>

        `;

    listaAtividades.appendChild(div);
  });
}



function verificarAtraso(atividade) {
  if (atividade.status === "concluida") {
    return false;
  }

  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);

  const dataConclusao = new Date(atividade.dataConclusao);

  dataConclusao.setHours(0, 0, 0, 0);

  return dataConclusao < hoje;
}



function editarAtividade(index) {
  const atividade = atividades[index];

  atividadeEditando = index;

  modalTitulo.textContent = "Editar atividade";

  document.getElementById("titulo").value = atividade.titulo;

  document.getElementById("descricao").value = atividade.descricao;

  document.getElementById("dataConclusao").value = atividade.dataConclusao;

  modal.style.display = "flex";
}



function concluirAtividade(index) {
  atividades[index].status = "concluida";

  mostrarAtividades();
}



function excluirAtividade(index) {
  const confirmar = confirm("Deseja realmente excluir esta atividade?");

  if (!confirmar) {
    return;
  }

  atividades.splice(index, 1);

  mostrarAtividades();
}



function formatarData(data) {
  if (!data) {
    return "";
  }

  const partes = data.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}



if (listaAtividades) {
  mostrarAtividades();
}



const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const login = document.getElementById("login").value;

    const senha = document.getElementById("senha").value;

    if (
      nome === "" ||
      sobrenome === "" ||
      dataNascimento === "" ||
      login === ""
    ) {
      cadastroMessage.textContent = "Preencha todos os campos.";

      return;
    }

    const loginMessage = document.getElementById("loginMessage");

    if (login.trim() === "" || senha.trim() === "") {
      loginMessage.textContent = "Preencha todos os campos.";

      return;
    }

    loginMessage.textContent = "Dados preenchidos corretamente.";
  });
}



const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {
  cadastroForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const senha = document.getElementById("senha").value;

    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const cadastroMessage = document.getElementById("cadastroMessage");

    const nome = document.getElementById("nome").value.trim();

    const sobrenome = document.getElementById("sobrenome").value.trim();

    const dataNascimento = document.getElementById("dataNascimento").value;

    const login = document.getElementById("login").value.trim();

    

    if (senha !== confirmarSenha) {
      cadastroMessage.textContent = "As senhas não são iguais.";

      return;
    }

    if (senha.length < 6) {
      cadastroMessage.textContent = "A senha deve ter pelo menos 6 caracteres.";

      return;
    }

    cadastroMessage.textContent =
      "Cadastro validado. Aguardando conexão com o servidor.";
  });
}
