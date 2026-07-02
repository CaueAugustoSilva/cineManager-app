import "./layout.js";

import {
    obterFilmes,
    obterSessoes,
    cadastrarSessao,
    atualizarSessao,
    excluirSessao
} from "./supabaseService.js";

import {
    escapeHTML,
    formatarMoeda,
    formatarDataHora,
    paraInputDateTime,
    setLinhaCarregando,
    setLinhaVazia,
    mostrarErro
} from "./ui.js";

const tabela = document.getElementById("tabelaSessoes");
const form = document.getElementById("formSessao");
const selectFilme = document.getElementById("idFilme");
const modalEl = document.getElementById("modalSessao");
const modal = new bootstrap.Modal(modalEl);
const tituloModal = document.getElementById("tituloModalSessao");

let sessoes = [];
let filmes = [];

async function carregarFilmesSelect() {
    try {
        filmes = await obterFilmes();

        selectFilme.innerHTML = `
            <option value="">Selecione</option>
            ${filmes.map(filme => `
                <option value="${filme.id_filme}">${escapeHTML(filme.titulo)}</option>
            `).join("")}
        `;
    } catch (erro) {
        selectFilme.innerHTML = `<option value="">Erro ao carregar filmes</option>`;
        mostrarErro(erro, "Falha ao carregar filmes no select");
    }
}

async function carregarSessoes() {
    setLinhaCarregando(tabela, 7);

    try {
        sessoes = await obterSessoes();

        if (sessoes.length === 0) {
            setLinhaVazia(tabela, 7, "Nenhuma sessão cadastrada.");
            return;
        }

        tabela.innerHTML = sessoes.map(sessao => `
            <tr>
                <td>${sessao.id_sessao}</td>
                <td>${escapeHTML(sessao.filmes?.titulo ?? "Filme não encontrado")}</td>
                <td>${formatarDataHora(sessao.data_hora)}</td>
                <td>${Number(sessao.sala)}</td>
                <td>${formatarMoeda(sessao.preco)}</td>
                <td>${Number(sessao.ingressos_vendidos ?? 0)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" data-acao="editar" data-id="${sessao.id_sessao}">Editar</button>
                    <button class="btn btn-danger btn-sm" data-acao="excluir" data-id="${sessao.id_sessao}">Excluir</button>
                </td>
            </tr>
        `).join("");
    } catch (erro) {
        setLinhaVazia(tabela, 7, "Erro ao carregar sessões.");
        mostrarErro(erro, "Falha ao carregar sessões");
    }
}

function limparFormulario() {
    form.reset();
    document.getElementById("idSessao").value = "";
    document.getElementById("ingressos").value = 0;
    tituloModal.textContent = "Cadastrar Sessão";
}

function preencherFormulario(sessao) {
    document.getElementById("idSessao").value = sessao.id_sessao;
    selectFilme.value = sessao.id_filme ?? sessao.filmes?.id_filme ?? "";
    document.getElementById("dataHora").value = paraInputDateTime(sessao.data_hora);
    document.getElementById("sala").value = sessao.sala ?? "";
    document.getElementById("preco").value = sessao.preco ?? "";
    document.getElementById("ingressos").value = sessao.ingressos_vendidos ?? 0;
    tituloModal.textContent = "Editar Sessão";
}

modalEl.addEventListener("show.bs.modal", event => {
    if (event.relatedTarget?.dataset.acao === "novo") {
        limparFormulario();
    }
});

tabela.addEventListener("click", async event => {
    const botao = event.target.closest("button[data-acao]");
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const acao = botao.dataset.acao;

    if (acao === "editar") {
        const sessao = sessoes.find(item => Number(item.id_sessao) === id);

        if (!sessao) {
            alert("Sessão não encontrada na lista atual.");
            return;
        }

        preencherFormulario(sessao);
        modal.show();
        return;
    }

    if (acao === "excluir") {
        const confirmar = confirm("Tem certeza que deseja excluir esta sessão? Se ela tiver ingressos vinculados, o banco pode bloquear a exclusão.");
        if (!confirmar) return;

        try {
            await excluirSessao(id);
            await carregarSessoes();
        } catch (erro) {
            mostrarErro(erro, "Não foi possível excluir a sessão");
        }
    }
});

form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("idSessao").value;

    const dados = {
        id_filme: Number(selectFilme.value),
        data_hora: document.getElementById("dataHora").value,
        sala: Number(document.getElementById("sala").value),
        preco: Number(document.getElementById("preco").value),
        ingressos_vendidos: Number(document.getElementById("ingressos").value)
    };

    try {
        if (id) {
            await atualizarSessao(id, dados);
        } else {
            await cadastrarSessao(dados);
        }

        limparFormulario();
        modal.hide();
        await carregarSessoes();
    } catch (erro) {
        mostrarErro(erro, "Não foi possível salvar a sessão");
    }
});

await carregarFilmesSelect();
await carregarSessoes();
