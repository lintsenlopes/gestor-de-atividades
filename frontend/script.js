/* ==========================================================================
   GESTOR DE ATIVIDADES - INTEGRAÇÃO FRONT-END E BACK-END (API PHP)
   ==========================================================================
   PRINCIPAIS ALTERAÇÕES REALIZADAS:
   1. Integração com a API PHP (api.php) centralizada via requisições HTTP (fetch)
      com rotas dinâmicas (?rota=login, ?rota=atividades, ?rota=concluir, etc.).
   2. Autenticação via Token JWT: Armazenamento e envio do token no cabeçalho
      "Authorization: Bearer <token>" em todas as requisições protegidas.
   3. Mapeamento e compatibilidade de dados: Ajuste dos nomes das propriedades
      para corresponder exatamente aos campos da tabela da BD (Titulo, Descricao,
      Data_Conclusao, Status).
   4. Tratamento dos dados retornados pelo MySQL e controle de sessão do usuário.
   ========================================================================== */

const API_URL = "../backend/api.php";

let atividades = [];
let atividadeEditandoId = null;

const modal = document.getElementById("atividadeModal");
const btnNovaAtividade = document.getElementById("btnNovaAtividade");
const btnFecharModal = document.getElementById("btnFecharModal");
const atividadeForm = document.getElementById("atividadeForm");
const listaAtividades = document.getElementById("listaAtividades");
const modalTitulo = document.getElementById("modalTitulo");
const btnLogout = document.getElementById("btnLogout");

function obterCabecalhos() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
}

if (listaAtividades && !localStorage.getItem("token")) {
    window.location.href = "index.html";
}

if (btnNovaAtividade) {
    btnNovaAtividade.addEventListener("click", function () {
        atividadeEditandoId = null;
        modalTitulo.textContent = "Nova atividade";
        atividadeForm.reset();
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

if (btnLogout) {
    btnLogout.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "index.html";
    });
}

async function carregarAtividades() {
    if (!listaAtividades) return;

    listaAtividades.innerHTML = `<p class="message">Carregando atividades...</p>`;

    try {
        const resposta = await fetch(`${API_URL}?rota=atividades`, {
            method: "GET",
            headers: obterCabecalhos()
        });

        if (resposta.status === 401) {
            localStorage.clear();
            window.location.href = "index.html";
            return;
        }

        const dados = await resposta.json();

        if (dados.sucesso) {
            atividades = dados.atividades || [];
            mostrarAtividades();
        } else {
            listaAtividades.innerHTML = `<p class="message">${dados.mensagem || 'Erro ao carregar atividades.'}</p>`;
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        listaAtividades.innerHTML = `<p class="message">Erro ao conectar com o servidor.</p>`;
    }
}

function mostrarAtividades() {
    listaAtividades.innerHTML = "";

    if (atividades.length === 0) {
        listaAtividades.innerHTML = `<p class="message">Nenhuma atividade cadastrada.</p>`;
        return;
    }

    atividades.forEach(function (atividade) {
        const atrasada = verificarAtraso(atividade);
        const div = document.createElement("div");

        div.className = "atividade";
        if (atrasada) div.classList.add("atrasada");
        if (atividade.Status === "Concluída" || atividade.status === "concluida" || atividade.Status === "concluída") {
            div.classList.add("concluida");
        }

        div.innerHTML = `
            <h3>${atividade.Titulo || atividade.titulo}</h3>
            <p>${atividade.Descricao || atividade.descricao || ''}</p>
            <p><strong>Data de criação:</strong> ${formatarData(atividade.Data_Criacao || atividade.data_criacao)}</p>
            <p><strong>Data de conclusão:</strong> ${formatarData(atividade.Data_Conclusao || atividade.data_conclusao)}</p>
            <p class="status"><strong>Status:</strong> ${atividade.Status || atividade.status}</p>

            ${atrasada ? `<p class="atrasada-texto">⚠ ATIVIDADE ATRASADA</p>` : ""}

            <div class="atividade-acoes">
                <button type="button" class="btn" onclick="editarAtividade(${atividade.Id || atividade.id})">Editar</button>
                ${(atividade.Status !== "Concluída" && atividade.status !== "concluida" && atividade.Status !== "concluída") ? `
                    <button type="button" class="btn" onclick="concluirAtividade(${atividade.Id || atividade.id})">Concluir</button>
                ` : ""}
                <button type="button" class="btn btn-secondary" onclick="excluirAtividade(${atividade.Id || atividade.id})">Excluir</button>
            </div>
        `;

        listaAtividades.appendChild(div);
    });
}

if (atividadeForm) {
    atividadeForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const titulo = document.getElementById("titulo").value.trim();
        const descricao = document.getElementById("descricao").value.trim();
        const dataConclusao = document.getElementById("dataConclusao").value;
        const atividadeMessage = document.getElementById("atividadeMessage");

        atividadeMessage.textContent = "";

        const payload = {
            titulo: titulo,
            descricao: descricao,
            data_conclusao: dataConclusao
        };

        try {
            let resposta;
            if (atividadeEditandoId !== null) {
                payload.id = atividadeEditandoId;
                payload.status = "Em aberto";
                
                resposta = await fetch(`${API_URL}?rota=atividades`, {
                    method: "PUT",
                    headers: obterCabecalhos(),
                    body: JSON.stringify(payload)
                });
            } else {
                resposta = await fetch(`${API_URL}?rota=atividades`, {
                    method: "POST",
                    headers: obterCabecalhos(),
                    body: JSON.stringify(payload)
                });
            }

            const dados = await resposta.json();

            if (dados.sucesso) {
                modal.style.display = "none";
                atividadeForm.reset();
                atividadeEditandoId = null;
                carregarAtividades();
            } else {
                atividadeMessage.textContent = dados.mensagem || "Erro ao salvar atividade.";
            }
        } catch (erro) {
            console.error("Erro ao salvar:", erro);
            atividadeMessage.textContent = "Erro de conexão com o servidor.";
        }
    });
}

function editarAtividade(id) {
    const atividade = atividades.find(a => (a.Id || a.id) === id);
    if (!atividade) return;

    atividadeEditandoId = id;
    modalTitulo.textContent = "Editar atividade";

    document.getElementById("titulo").value = atividade.Titulo || atividade.titulo;
    document.getElementById("descricao").value = atividade.Descricao || atividade.descricao;
    document.getElementById("dataConclusao").value = (atividade.Data_Conclusao || atividade.data_conclusao).split(" ")[0];

    modal.style.display = "flex";
}

async function concluirAtividade(id) {
    try {
        const resposta = await fetch(`${API_URL}?rota=concluir`, {
            method: "POST",
            headers: obterCabecalhos(),
            body: JSON.stringify({ id: id })
        });

        const dados = await resposta.json();
        if (dados.sucesso) {
            carregarAtividades();
        } else {
            alert(dados.mensagem || "Erro ao concluir atividade.");
        }
    } catch (erro) {
        console.error("Erro ao concluir:", erro);
    }
}

async function excluirAtividade(id) {
    if (!confirm("Deseja realmente excluir esta atividade?")) return;

    try {
        const resposta = await fetch(`${API_URL}?rota=atividades&id=${id}`, {
            method: "DELETE",
            headers: obterCabecalhos()
        });

        const dados = await resposta.json();
        if (dados.sucesso) {
            carregarAtividades();
        } else {
            alert(dados.mensagem || "Erro ao excluir atividade.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

function verificarAtraso(atividade) {
    const st = atividade.Status || atividade.status;
    if (st === "Concluída" || st === "concluida" || st === "concluída") return false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataConcStr = atividade.Data_Conclusao || atividade.data_conclusao;
    if (!dataConcStr) return false;

    const dataConclusao = new Date(dataConcStr);
    dataConclusao.setHours(0, 0, 0, 0);

    return dataConclusao < hoje;
}

function formatarData(data) {
    if (!data) return "";
    const partes = data.split(" ")[0].split("-");
    if (partes.length < 3) return data;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

if (listaAtividades) {
    carregarAtividades();
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const loginInput = document.getElementById("login").value.trim();
        const senhaInput = document.getElementById("senha").value;
        const loginMessage = document.getElementById("loginMessage");
        const botaoEntrar = loginForm.querySelector('button[type="submit"]');

        loginMessage.textContent = "";

        if (!loginInput || !senhaInput) {
            loginMessage.textContent = "Preencha todos os campos.";
            return;
        }

        botaoEntrar.disabled = true;
        botaoEntrar.textContent = "Entrando...";

        try {
            const resposta = await fetch(`${API_URL}?rota=login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: loginInput, senha: senhaInput })
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                loginMessage.textContent = dados.mensagem || "Usuário ou senha incorretos.";
                return;
            }

            localStorage.setItem("token", dados.token);
            localStorage.setItem("usuario", JSON.stringify(dados.usuario));

            window.location.href = "principal.html";
        } catch (erro) {
            loginMessage.textContent = "Erro ao conectar com o servidor.";
            console.error("Erro no login:", erro);
        } finally {
            botaoEntrar.disabled = false;
            botaoEntrar.textContent = "Entrar";
        }
    });
}

const cadastroForm = document.getElementById("cadastroForm");
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

        if (!nome || !sobrenome || !dataNascimento || !login || !senha || !confirmarSenha) {
            cadastroMessage.textContent = "Preencha todos os campos.";
            return;
        }

        if (senha !== confirmarSenha) {
            cadastroMessage.textContent = "As senhas não são iguais.";
            return;
        }

        if (senha.length < 8) {
            cadastroMessage.textContent = "A senha deve ter no mínimo 8 caracteres.";
            return;
        }

        botaoCadastrar.disabled = true;
        botaoCadastrar.textContent = "Cadastrando...";

        try {
            const resposta = await fetch(`${API_URL}?rota=cadastrar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome,
                    sobrenome: sobrenome,
                    data_nascimento: dataNascimento,
                    login: login,
                    senha: senha
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                cadastroMessage.textContent = dados.mensagem || "Não foi possível realizar o cadastro.";
                return;
            }

            cadastroMessage.style.color = "green";
            cadastroMessage.textContent = dados.mensagem || "Usuário cadastrado com sucesso!";
            cadastroForm.reset();
        } catch (erro) {
            cadastroMessage.textContent = "Erro ao conectar com o servidor.";
            console.error("Erro no cadastro:", erro);
        } finally {
            botaoCadastrar.disabled = false;
            botaoCadastrar.textContent = "Cadastrar";
        }
    });
}