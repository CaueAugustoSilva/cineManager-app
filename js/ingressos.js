import "./layout.js";

import {
    obterClientes,
    obterSessoes,
    obterIngressos,
    cadastrarIngresso,
    atualizarIngresso,
    excluirIngresso
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

const tabela = document.getElementById("tabelaIngressos");
const form = document.getElementById("formIngresso");
const selectCliente = document.getElementById("idCliente");
const selectSessao = document.getElementById("idSessao");
const modalEl = document.getElementById("modalIngresso");
const modal = new bootstrap.Modal(modalEl);
const tituloModal = document.getElementById("tituloModalIngresso");

let clientes = [];
let sessoes = [];
let ingressos = [];

async function carregarSelects() {
    try {
        clientes = await obterClientes();
        sessoes = await obterSessoes();

        selectCliente.innerHTML = `
            <option value="">Selecione</option>
            ${clientes.map(cliente => `
                <option value="${cliente.id_cliente}">${escapeHTML(cliente.nome)}</option>
            `).join("")}
        `;

        selectSessao.innerHTML = `
            <option value="">Selecione</option>
            ${sessoes.map(sessao => `
                <option value="${sessao.id_sessao}">
                    ${escapeHTML(sessao.filmes?.titulo ?? "Filme não encontrado")} — ${formatarDataHora(sessao.data_hora)} — Sala ${escapeHTML(sessao.sala)}
                </option>
            `).join("")}
        `;
    } catch (erro) {
        mostrarErro(erro, "Falha ao carregar clientes/sessões");
    }
}

async function carregarIngressos() {
    setLinhaCarregando(tabela, 8);

    try {
        ingressos = await obterIngressos();

        if (ingressos.length === 0) {
            setLinhaVazia(tabela, 8, "Nenhum ingresso cadastrado.");
            return;
        }

        tabela.innerHTML = ingressos.map(ingresso => {
            const sessao = ingresso.sessoes;
            const tituloFilme = sessao?.filmes?.titulo ?? "Filme não encontrado";
            const descricaoSessao = `${tituloFilme} — ${formatarDataHora(sessao?.data_hora)} — Sala ${sessao?.sala ?? "-"}`;

            return `
                <tr>
                    <td>${ingresso.id_ingresso}</td>
                    <td>${escapeHTML(ingresso.clientes?.nome ?? "Cliente não encontrado")}</td>
                    <td>${escapeHTML(descricaoSessao)}</td>
                    <td>${escapeHTML(ingresso.assento)}</td>
                    <td>${escapeHTML(ingresso.forma_pagamento)}</td>
                    <td>${formatarMoeda(ingresso.valor_pago)}</td>
                    <td>${formatarDataHora(ingresso.data_compra)}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-acao="editar" data-id="${ingresso.id_ingresso}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-acao="excluir" data-id="${ingresso.id_ingresso}">Excluir</button>
                    </td>
                </tr>
            `;
        }).join("");
    } catch (erro) {
        setLinhaVazia(tabela, 8, "Erro ao carregar ingressos.");
        mostrarErro(erro, "Falha ao carregar ingressos");
    }
}

function limparFormulario() {
    form.reset();
    document.getElementById("idIngresso").value = "";
    document.getElementById("dataCompra").value = "";
    tituloModal.textContent = "Cadastrar Ingresso";
}

function preencherFormulario(ingresso) {
    document.getElementById("idIngresso").value = ingresso.id_ingresso;
    selectCliente.value = ingresso.id_cliente ?? "";
    selectSessao.value = ingresso.id_sessao ?? "";
    document.getElementById("assento").value = ingresso.assento ?? "";
    document.getElementById("formaPagamento").value = ingresso.forma_pagamento ?? "";
    document.getElementById("valorPago").value = ingresso.valor_pago ?? "";
    document.getElementById("dataCompra").value = paraInputDateTime(ingresso.data_compra);
    tituloModal.textContent = "Editar Ingresso";
}

function preencherPrecoDaSessao() {
    const idSessao = Number(selectSessao.value);
    const sessao = sessoes.find(item => Number(item.id_sessao) === idSessao);

    if (sessao && !document.getElementById("idIngresso").value) {
        document.getElementById("valorPago").value = sessao.preco ?? "";
    }
}

modalEl.addEventListener("show.bs.modal", event => {
    if (event.relatedTarget?.dataset.acao === "novo") {
        limparFormulario();
    }
});

selectSessao.addEventListener("change", preencherPrecoDaSessao);

tabela.addEventListener("click", async event => {
    const botao = event.target.closest("button[data-acao]");
    if (!botao) return;

    const id = Number(botao.dataset.id);
    const acao = botao.dataset.acao;

    if (acao === "editar") {
        const ingresso = ingressos.find(item => Number(item.id_ingresso) === id);

        if (!ingresso) {
            alert("Ingresso não encontrado na lista atual.");
            return;
        }

        preencherFormulario(ingresso);
        modal.show();
        return;
    }

    if (acao === "excluir") {
        const confirmar = confirm("Tem certeza que deseja excluir este ingresso?");
        if (!confirmar) return;

        try {
            await excluirIngresso(id);
            await carregarIngressos();
        } catch (erro) {
            mostrarErro(erro, "Não foi possível excluir o ingresso");
        }
    }
});

form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("idIngresso").value;
    const dataCompraInformada = document.getElementById("dataCompra").value;

    const dados = {
        id_cliente: Number(selectCliente.value),
        id_sessao: Number(selectSessao.value),
        assento: document.getElementById("assento").value.trim().toUpperCase(),
        forma_pagamento: document.getElementById("formaPagamento").value,
        valor_pago: Number(document.getElementById("valorPago").value),
        data_compra: dataCompraInformada || new Date().toISOString()
    };

    try {
        if (id) {
            await atualizarIngresso(id, dados);
        } else {
            await cadastrarIngresso(dados);
        }

        limparFormulario();
        modal.hide();
        await carregarIngressos();
    } catch (erro) {
        mostrarErro(erro, "Não foi possível salvar o ingresso");
    }
});

await carregarSelects();
await carregarIngressos();
