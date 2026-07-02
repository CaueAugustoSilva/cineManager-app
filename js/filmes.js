import "./layout.js";

import {
    obterFilmes,
    cadastrarFilme,
    atualizarFilme,
    excluirFilme
} from "./supabaseService.js";

import {
    escapeHTML,
    setLinhaCarregando,
    setLinhaVazia,
    mostrarErro
} from "./ui.js";

const tabela = document.getElementById("tabelaFilmes");
const form = document.getElementById("formFilme");
const modalEl = document.getElementById("modalFilme");
const modal = new bootstrap.Modal(modalEl);
const tituloModal = document.getElementById("tituloModalFilme");

let filmes = [];

async function carregarFilmes() {
    setLinhaCarregando(tabela, 7);

    try {
        filmes = await obterFilmes();

        if (filmes.length === 0) {
            setLinhaVazia(tabela, 7, "Nenhum filme cadastrado.");
            return;
        }

        tabela.innerHTML = filmes.map(filme => `
            <tr>
                <td>${filme.id_filme}</td>
                <td>${escapeHTML(filme.titulo)}</td>
                <td>${escapeHTML(filme.genero)}</td>
                <td>${Number(filme.duracao)} min</td>
                <td>${escapeHTML(filme.classificacao)}</td>
                <td>${escapeHTML(filme.diretor)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" data-acao="editar" data-id="${filme.id_filme}">Editar</button>
                    <button class="btn btn-danger btn-sm" data-acao="excluir" data-id="${filme.id_filme}">Excluir</button>
                </td>
            </tr>
        `).join("");
    } catch (erro) {
        setLinhaVazia(tabela, 7, "Erro ao carregar filmes.");
        mostrarErro(erro, "Falha ao carregar filmes");
    }
}

function limparFormulario() {
    form.reset();
    document.getElementById("idFilme").value = "";
    tituloModal.textContent = "Cadastrar Filme";
}

function preencherFormulario(filme) {
    document.getElementById("idFilme").value = filme.id_filme;
    document.getElementById("titulo").value = filme.titulo ?? "";
    document.getElementById("genero").value = filme.genero ?? "";
    document.getElementById("duracao").value = filme.duracao ?? "";
    document.getElementById("classificacao").value = filme.classificacao ?? "";
    document.getElementById("diretor").value = filme.diretor ?? "";
    tituloModal.textContent = "Editar Filme";
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
        const filme = filmes.find(item => Number(item.id_filme) === id);

        if (!filme) {
            alert("Filme não encontrado na lista atual.");
            return;
        }

        preencherFormulario(filme);
        modal.show();
        return;
    }

    if (acao === "excluir") {
        const confirmar = confirm("Tem certeza que deseja excluir este filme? Se ele tiver sessões vinculadas, o banco pode bloquear a exclusão.");
        if (!confirmar) return;

        try {
            await excluirFilme(id);
            await carregarFilmes();
        } catch (erro) {
            mostrarErro(erro, "Não foi possível excluir o filme");
        }
    }
});

form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("idFilme").value;

    const dados = {
        titulo: document.getElementById("titulo").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        duracao: Number(document.getElementById("duracao").value),
        classificacao: document.getElementById("classificacao").value,
        diretor: document.getElementById("diretor").value.trim()
    };

    try {
        if (id) {
            await atualizarFilme(id, dados);
        } else {
            await cadastrarFilme(dados);
        }

        limparFormulario();
        modal.hide();
        await carregarFilmes();
    } catch (erro) {
        mostrarErro(erro, "Não foi possível salvar o filme");
    }
});

carregarFilmes();
