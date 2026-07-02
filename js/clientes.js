import "./layout.js";

import {
    obterClientes,
    cadastrarCliente,
    atualizarCliente,
    excluirCliente
} from "./supabaseService.js";

import {
    escapeHTML,
    formatarData,
    formatarDataHora,
    setLinhaCarregando,
    setLinhaVazia,
    mostrarErro
} from "./ui.js";

const tabela = document.getElementById("tabelaClientes");
const form = document.getElementById("formCliente");
const modalEl = document.getElementById("modalCliente");
const modal = new bootstrap.Modal(modalEl);
const tituloModal = document.getElementById("tituloModalCliente");

let clientes = [];

async function carregarClientes() {
    setLinhaCarregando(tabela, 8);

    try {
        clientes = await obterClientes();

        if (clientes.length === 0) {
            setLinhaVazia(tabela, 8, "Nenhum cliente cadastrado.");
            return;
        }

        tabela.innerHTML = clientes.map(cliente => `
            <tr>
                <td>${cliente.id_cliente}</td>
                <td>${escapeHTML(cliente.nome)}</td>
                <td>${escapeHTML(cliente.cpf)}</td>
                <td>${escapeHTML(cliente.email)}</td>
                <td>${escapeHTML(cliente.telefone ?? "-")}</td>
                <td>${formatarData(cliente.data_nascimento)}</td>
                <td>${formatarDataHora(cliente.data_cadastro)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" data-acao="editar" data-id="${cliente.id_cliente}">Editar</button>
                    <button class="btn btn-danger btn-sm" data-acao="excluir" data-id="${cliente.id_cliente}">Excluir</button>
                </td>
            </tr>
        `).join("");
    } catch (erro) {
        setLinhaVazia(tabela, 8, "Erro ao carregar clientes.");
        mostrarErro(erro, "Falha ao carregar clientes");
    }
}

function limparFormulario() {
    form.reset();
    document.getElementById("idCliente").value = "";
    tituloModal.textContent = "Cadastrar Cliente";
}

function preencherFormulario(cliente) {
    document.getElementById("idCliente").value = cliente.id_cliente;
    document.getElementById("nome").value = cliente.nome ?? "";
    document.getElementById("cpf").value = cliente.cpf ?? "";
    document.getElementById("email").value = cliente.email ?? "";
    document.getElementById("telefone").value = cliente.telefone ?? "";
    document.getElementById("dataNascimento").value = cliente.data_nascimento ?? "";
    tituloModal.textContent = "Editar Cliente";
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
        const cliente = clientes.find(item => Number(item.id_cliente) === id);

        if (!cliente) {
            alert("Cliente não encontrado na lista atual.");
            return;
        }

        preencherFormulario(cliente);
        modal.show();
        return;
    }

    if (acao === "excluir") {
        const confirmar = confirm("Tem certeza que deseja excluir este cliente? Se ele tiver ingressos vinculados, o banco pode bloquear a exclusão.");
        if (!confirmar) return;

        try {
            await excluirCliente(id);
            await carregarClientes();
        } catch (erro) {
            mostrarErro(erro, "Não foi possível excluir o cliente");
        }
    }
});

form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("idCliente").value;

    const dados = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefone: document.getElementById("telefone").value.trim() || null,
        data_nascimento: document.getElementById("dataNascimento").value || null
    };

    try {
        if (id) {
            await atualizarCliente(id, dados);
        } else {
            await cadastrarCliente(dados);
        }

        limparFormulario();
        modal.hide();
        await carregarClientes();
    } catch (erro) {
        mostrarErro(erro, "Não foi possível salvar o cliente");
    }
});

carregarClientes();
