const API_URL = "../backend/api.php";

let atividadesCache = [];
let atividadeEditandoId = null;

const modal = document.getElementById("atividadeModal");
const btnNovaAtividade = document.getElementById("btnNovaAtividade");
const btnFecharModal = document.getElementById("btnFecharModal");
const atividadeForm = document.getElementById("atividadeForm");
const listaAtividades = document.getElementById("listaAtividades");
const modalTitulo = document.getElementById("modalTitulo");
const atividadeMessage = document.getElementById("atividadeMessage");
const loginForm = document.getElementById("loginForm");
const cadastroForm = document.getElementById("cadastroForm");

// ---------- Utilidades ----------

function getToken() {
  return localStorage.getItem("token");
}

function headerAutenticado() {
  return { "Authorization": "Bearer " + getToken() };
}

function sair() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// Se o token expirou ou é inválido, volta pro login
function sessaoExpirou(resposta) {
  if (resposta.status === 401) {
    sair();
    return true;
  }
  return false;
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function estaConcluida(atividade) {
  return String(atividade.Status).toLowerCase() === "concluída";
}

function formatarData(data) {
  if (!data) return "";
  const partes = data.split(" ")[0].split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function verificarAtraso(atividade) {
  if (estaConcluida(atividade)) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataConclusao = new Date(atividade.Data_Conclusao.replace(" ", "T"));
  dataConclusao.setHours(0, 0, 0, 0);
  return dataConclusao < hoje;
}

// ---------- Proteção de telas ----------

if (listaAtividades && !getToken()) {
  window.location.href = "index.html";
}

if (loginForm && getToken()) {
  window.location.href = "principal.html";
}

// ---------- Modal ----------

if (btnNovaAtividade) {
  btnNovaAtividade.addEventListener("click", function () {
    atividadeEditandoId = null;
    modalTitulo.textContent = "Nova atividade";
    atividadeForm.reset();
    atividadeMessage.textContent = "";
    modal.style.display = "flex";
  });
}

if (btnFecharModal) {
  btnFecharModal.addEventListener("click", function () {
    modal.style.display = "none";
    atividadeForm.reset();
    atividadeEditandoId = null;
  });
}

// ---------- Criar ou editar ----------

if (atividadeForm) {
  atividadeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const dataConclusao = document.getElementById("dataConclusao").value;

    atividadeMessage.textContent = "";

    try {
      let resposta;

      if (atividadeEditandoId !== null) {
        const original = atividadesCache.find(a => a.Id == atividadeEditandoId);

        const params = new URLSearchParams();
        params.append("id", atividadeEditandoId);
        params.append("titulo", titulo);
        params.append("descricao", descricao);
        params.append("data_conclusao", dataConclusao);
        params.append("status", original ? original.Status : "Em aberto");

        resposta = await fetch(`${API_URL}?rota=atividades`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...headerAutenticado()
          },
          body: params
        });
      } else {
        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descricao", descricao);
        formData.append("data_conclusao", dataConclusao);

        resposta = await fetch(`${API_URL}?rota=atividades`, {
          method: "POST",
          headers: headerAutenticado(),
          body: formData
        });
      }

      if (sessaoExpirou(resposta)) return;

      const dados = await resposta.json();

      if (!resposta.ok || dados.sucesso !== true) {
        atividadeMessage.textContent = dados.mensagem || "Erro ao salvar atividade.";
        return;
      }

      modal.style.display = "none";
      atividadeForm.reset();
      atividadeEditandoId = null;
      await carregarAtividades();

    } catch (erro) {
      atividadeMessage.textContent = "Erro ao conectar com o servidor.";
      console.error("Erro ao salvar atividade:", erro);
    }
  });
}

// ---------- Listar ----------

async function carregarAtividades() {
  try {
    const resposta = await fetch(`${API_URL}?rota=atividades`, {
      method: "GET",
      headers: headerAutenticado()
    });

    if (sessaoExpirou(resposta)) return;

    const dados = await resposta.json();

    if (!resposta.ok || dados.sucesso !== true) {
      listaAtividades.innerHTML = `<p class="message">Não foi possível carregar as atividades.</p>`;
      return;
    }

    atividadesCache = dados.atividades;
    mostrarAtividades();

  } catch (erro) {
    listaAtividades.innerHTML = `<p class="message">Erro ao conectar com o servidor.</p>`;
    console.error("Erro ao carregar atividades:", erro);
  }
}

function mostrarAtividades() {
  listaAtividades.innerHTML = "";

  if (atividadesCache.length === 0) {
    listaAtividades.innerHTML = `<p class="message">Nenhuma atividade cadastrada.</p>`;
    return;
  }

  atividadesCache.forEach(function (atividade) {
    const concluida = estaConcluida(atividade);
    const atrasada = verificarAtraso(atividade);

    const div = document.createElement("div");
    div.className = "atividade";
    if (atrasada) div.classList.add("atrasada");
    if (concluida) div.classList.add("concluida");

    div.innerHTML = `
      <h3>${escapar(atividade.Titulo)}</h3>
      <p>${escapar(atividade.Descricao)}</p>
      <p><strong>Data de criação:</strong> ${formatarData(atividade.Data_Criacao)}</p>
      <p><strong>Data de conclusão:</strong> ${formatarData(atividade.Data_Conclusao)}</p>
      <p class="status"><strong>Status:</strong> ${concluida ? "Concluída" : "Em aberto"}</p>
      ${atrasada ? `<p class="atrasada-texto">⚠ ATIVIDADE ATRASADA</p>` : ""}
      <div class="atividade-acoes">
        <button type="button" class="btn" onclick="editarAtividade(${atividade.Id})">Editar</button>
        ${!concluida ? `<button type="button" class="btn" onclick="concluirAtividade(${atividade.Id})">Concluir</button>` : ""}
        <button type="button" class="btn btn-secondary" onclick="excluirAtividade(${atividade.Id})">Excluir</button>
      </div>
    `;

    listaAtividades.appendChild(div);
  });
}

// ---------- Editar / Concluir / Excluir ----------

function editarAtividade(id) {
  const atividade = atividadesCache.find(a => a.Id == id);
  if (!atividade) return;

  atividadeEditandoId = id;
  modalTitulo.textContent = "Editar atividade";
  atividadeMessage.textContent = "";
  document.getElementById("titulo").value = atividade.Titulo;
  document.getElementById("descricao").value = atividade.Descricao;
  document.getElementById("dataConclusao").value = atividade.Data_Conclusao.split(" ")[0];
  modal.style.display = "flex";
}

async function concluirAtividade(id) {
  try {
    const formData = new FormData();
    formData.append("id", id);

    const resposta = await fetch(`${API_URL}?rota=concluir`, {
      method: "POST",
      headers: headerAutenticado(),
      body: formData
    });

    if (sessaoExpirou(resposta)) return;

    const dados = await resposta.json();

    if (!resposta.ok || dados.sucesso !== true) {
      alert(dados.mensagem || "Erro ao concluir atividade.");
      return;
    }

    await carregarAtividades();

  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
    console.error("Erro ao concluir atividade:", erro);
  }
}

async function excluirAtividade(id) {
  if (!confirm("Deseja realmente excluir esta atividade?")) return;

  try {
    const resposta = await fetch(`${API_URL}?rota=atividades&id=${id}`, {
      method: "DELETE",
      headers: headerAutenticado()
    });

    if (sessaoExpirou(resposta)) return;

    const dados = await resposta.json();

    if (!resposta.ok || dados.sucesso !== true) {
      alert(dados.mensagem || "Erro ao excluir atividade.");
      return;
    }

    await carregarAtividades();

  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
    console.error("Erro ao excluir atividade:", erro);
  }
}

if (listaAtividades) {
  carregarAtividades();
}

// ---------- Logout ----------

const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", sair);
}

// ---------- Login ----------

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const login = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value;
    const loginMessage = document.getElementById("loginMessage");
    const botaoEntrar = loginForm.querySelector('button[type="submit"]');

    loginMessage.textContent = "";

    if (login === "" || senha.trim() === "") {
      loginMessage.textContent = "Preencha todos os campos.";
      return;
    }

    botaoEntrar.disabled = true;
    botaoEntrar.textContent = "Entrando...";

    const formData = new FormData();
    formData.append("login", login);
    formData.append("senha", senha);

    try {
      const resposta = await fetch(`${API_URL}?rota=login`, {
        method: "POST",
        body: formData
      });

      const dados = await resposta.json();

      if (!resposta.ok || dados.sucesso !== true) {
        loginMessage.textContent = dados.mensagem || "Usuário ou senha incorretos.";
        return;
      }

      localStorage.setItem("token", dados.token);
      window.location.href = "principal.html";

    } catch (erro) {
      loginMessage.textContent = "Erro ao conectar com o servidor. Tente novamente.";
      console.error("Erro no login:", erro);

    } finally {
      botaoEntrar.disabled = false;
      botaoEntrar.textContent = "Entrar";
    }
  });
}

// ---------- Cadastro ----------

if (cadastroForm) {
  cadastroForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value;
    const login = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const cadastroMessage = document.getElementById("cadastroMessage");
    const botaoCadastrar = cadastroForm.querySelector('button[type="submit"]');

    cadastroMessage.textContent = "";

    if (nome === "" || sobrenome === "" || dataNascimento === "" || login === "" || senha.trim() === "" || confirmarSenha.trim() === "") {
      cadastroMessage.textContent = "Preencha todos os campos.";
      return;
    }

    if (senha !== confirmarSenha) {
      cadastroMessage.textContent = "As senhas não são iguais.";
      return;
    }

    if (senha.length < 6 || senha.length > 64) {
      cadastroMessage.textContent = "A senha deve ter entre 6 e 64 caracteres.";
      return;
    }

    botaoCadastrar.disabled = true;
    botaoCadastrar.textContent = "Cadastrando...";

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("sobrenome", sobrenome);
    formData.append("data_nascimento", dataNascimento);
    formData.append("login", login);
    formData.append("senha", senha);

    try {
      const resposta = await fetch(`${API_URL}?rota=cadastrar`, {
        method: "POST",
        body: formData
      });

      const dados = await resposta.json();

      if (!resposta.ok || dados.sucesso !== true) {
        cadastroMessage.textContent = dados.mensagem || "Não foi possível realizar o cadastro.";
        return;
      }

      cadastroMessage.textContent = dados.mensagem || "Usuário cadastrado com sucesso.";
      cadastroForm.reset();

    } catch (erro) {
      cadastroMessage.textContent = "Erro ao conectar com o servidor. Tente novamente.";
      console.error("Erro no cadastro:", erro);

    } finally {
      botaoCadastrar.disabled = false;
      botaoCadastrar.textContent = "Cadastrar";
    }
  });
}