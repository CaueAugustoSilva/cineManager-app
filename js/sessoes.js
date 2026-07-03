import "./layout.js";

import { supabase } from "./supabaseClient.js";

import {
  obterFilmes,
  obterSessoes,
  cadastrarSessao,
  atualizarSessao,
  excluirSessao,
} from "./supabaseService.js";

import {
  escapeHTML,
  formatarMoeda,
  formatarDataHora,
  paraInputDateTime,
  setLinhaCarregando,
  setLinhaVazia,
  mostrarErro,
} from "./ui.js";

const tabela = document.getElementById("tabelaSessoes");
const form = document.getElementById("formSessao");
const selectFilme = document.getElementById("idFilme");
const modalEl = document.getElementById("modalSessao");
const modal = new bootstrap.Modal(modalEl);
const tituloModal = document.getElementById("tituloModalSessao");

const modalConsultaSessoesEl = document.getElementById("modalConsultaSessoes");
const modalConsultaSessoes = new bootstrap.Modal(modalConsultaSessoesEl);

const modalFilmesSessoesEl = document.getElementById("modalFilmesSessoes");
const modalFilmesSessoes = new bootstrap.Modal(modalFilmesSessoesEl);

const modalDataSessoesEl = document.getElementById("modalDataSessoes");
const modalDataSessoes = new bootstrap.Modal(modalDataSessoesEl);

const modalSalaSessoesEl = document.getElementById("modalSalaSessoes");
const modalSalaSessoes = new bootstrap.Modal(modalSalaSessoesEl);

const modalPrecoSessoesEl = document.getElementById("modalPrecoSessoes");
const modalPrecoSessoes = new bootstrap.Modal(modalPrecoSessoesEl);

const modalGenerosSessoesEl = document.getElementById("modalGenerosSessoes");
const modalGenerosSessoes = new bootstrap.Modal(modalGenerosSessoesEl);

const listaFilmesSessoes = document.getElementById("listaFilmesSessoes");
const listaGenerosSessoes = document.getElementById("listaGenerosSessoes");

const cardRelatorioSessoes = document.getElementById("cardRelatorioSessoes");
const tituloRelatorioSessoes = document.getElementById(
  "tituloRelatorioSessoes",
);
const subtituloRelatorioSessoes = document.getElementById(
  "subtituloRelatorioSessoes",
);
const resultadoRelatorioSessoes = document.getElementById(
  "resultadoRelatorioSessoes",
);
const btnLimparRelatorioSessoes = document.getElementById(
  "btnLimparRelatorioSessoes",
);

const btnAbrirConsultaSessoesPorFilme = document.getElementById(
  "btnAbrirConsultaSessoesPorFilme",
);
const btnAbrirConsultaSessoesPorData = document.getElementById(
  "btnAbrirConsultaSessoesPorData",
);
const btnAbrirConsultaSessoesPorSala = document.getElementById(
  "btnAbrirConsultaSessoesPorSala",
);
const btnAbrirConsultaSessoesPorPreco = document.getElementById(
  "btnAbrirConsultaSessoesPorPreco",
);
const btnAbrirConsultaSessoesPorGenero = document.getElementById(
  "btnAbrirConsultaSessoesPorGenero",
);
const btnConsultaSessoesSemVenda = document.getElementById(
  "btnConsultaSessoesSemVenda",
);
const btnConsultaSessoesMaisVendidas = document.getElementById(
  "btnConsultaSessoesMaisVendidas",
);

const formConsultaDataSessoes = document.getElementById(
  "formConsultaDataSessoes",
);
const dataInicioSessoes = document.getElementById("dataInicioSessoes");
const dataFimSessoes = document.getElementById("dataFimSessoes");

const formConsultaSalaSessoes = document.getElementById(
  "formConsultaSalaSessoes",
);
const inputSalaSessoes = document.getElementById("inputSalaSessoes");

const formConsultaPrecoSessoes = document.getElementById(
  "formConsultaPrecoSessoes",
);
const inputPrecoMaximoSessoes = document.getElementById(
  "inputPrecoMaximoSessoes",
);

let sessoes = [];
let filmes = [];
let generosDisponiveis = [];

async function carregarFilmesSelect() {
  try {
    filmes = await obterFilmes();

    selectFilme.innerHTML = `
            <option value="">Selecione</option>
            ${filmes
              .map(
                (filme) => `
                <option value="${filme.id_filme}">${escapeHTML(filme.titulo)}</option>
            `,
              )
              .join("")}
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

    tabela.innerHTML = sessoes
      .map(
        (sessao) => `
            <tr>
                <td>${sessao.id_sessao}</td>
                <td>${escapeHTML(sessao.filmes?.titulo ?? "Filme não encontrado")}</td>
                <td>${formatarDataHora(sessao.data_hora)}</td>
                <td>${Number(sessao.sala)}</td>
                <td>${formatarMoeda(sessao.preco)}</td>
                <td>${Number(sessao.ingressos_vendidos ?? 0)}</td>
                <td>
                    <div class="acoes-tabela">
                        <button 
                            class="btn-acao btn-editar" 
                            data-acao="editar" 
                            data-id="${sessao.id_sessao}"
                            title="Editar sessão"
                            aria-label="Editar sessão">
                            <span class="icone-acao">✎</span>
                        </button>

                        <button 
                            class="btn-acao btn-excluir" 
                            data-acao="excluir" 
                            data-id="${sessao.id_sessao}"
                            title="Excluir sessão"
                            aria-label="Excluir sessão">
                            <span class="icone-excluir">×</span>
                        </button>
                    </div>
                </td>
            </tr>
        `,
      )
      .join("");
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
  document.getElementById("dataHora").value = paraInputDateTime(
    sessao.data_hora,
  );
  document.getElementById("sala").value = sessao.sala ?? "";
  document.getElementById("preco").value = sessao.preco ?? "";
  document.getElementById("ingressos").value = sessao.ingressos_vendidos ?? 0;
  tituloModal.textContent = "Editar Sessão";
}

function abrirModalDepoisDeFechar(modalAtualEl, modalAtual, modalDestino) {
  modalAtualEl.addEventListener(
    "hidden.bs.modal",
    () => {
      modalDestino.show();
    },
    { once: true },
  );

  modalAtual.hide();
}

function mostrarMensagemRelatorio(titulo, mensagem) {
  cardRelatorioSessoes.classList.remove("d-none");
  tituloRelatorioSessoes.textContent = titulo;
  subtituloRelatorioSessoes.textContent = "";
  resultadoRelatorioSessoes.innerHTML = `<p class="text-muted mb-0">${escapeHTML(mensagem)}</p>`;
  cardRelatorioSessoes.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderizarTabelaRelatorioSessoes(titulo, subtitulo, colunas, linhas) {
  cardRelatorioSessoes.classList.remove("d-none");
  tituloRelatorioSessoes.textContent = titulo;
  subtituloRelatorioSessoes.textContent = subtitulo;

  if (linhas.length === 0) {
    resultadoRelatorioSessoes.innerHTML = `<p class="text-muted mb-0">Nenhuma sessão encontrada para esta consulta.</p>`;
    cardRelatorioSessoes.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  resultadoRelatorioSessoes.innerHTML = `
        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle mb-0">
                <thead class="table-dark">
                    <tr>
                        ${colunas.map((coluna) => `<th>${escapeHTML(coluna)}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    ${linhas
                      .map(
                        (linha) => `
                        <tr>
                            ${linha.map((celula) => `<td>${celula}</td>`).join("")}
                        </tr>
                    `,
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    `;

  cardRelatorioSessoes.scrollIntoView({ behavior: "smooth", block: "start" });
}

function linhasSessoesTabelaUnica(listaSessoes) {
  return listaSessoes.map((sessao) => [
    sessao.id_sessao,
    sessao.id_filme,
    formatarDataHora(sessao.data_hora),
    Number(sessao.sala),
    formatarMoeda(sessao.preco),
    Number(sessao.ingressos_vendidos ?? 0),
  ]);
}

function prepararModalFilmesSessoes() {
  const filmesOrdenados = [...filmes].sort((a, b) =>
    a.titulo.localeCompare(b.titulo, "pt-BR"),
  );

  if (filmesOrdenados.length === 0) {
    listaFilmesSessoes.innerHTML = `<p class="text-muted mb-0">Nenhum filme cadastrado no sistema.</p>`;
    return;
  }

  listaFilmesSessoes.innerHTML = filmesOrdenados
    .map(
      (filme) => `
        <button class="btn btn-outline-primary text-start" type="button" data-id-filme="${filme.id_filme}">
            ${escapeHTML(filme.titulo)}
        </button>
    `,
    )
    .join("");
}

function prepararModalGenerosSessoes() {
  generosDisponiveis = [
    ...new Set(filmes.map((filme) => filme.genero).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  if (generosDisponiveis.length === 0) {
    listaGenerosSessoes.innerHTML = `<p class="text-muted mb-0">Nenhum gênero cadastrado no sistema.</p>`;
    return;
  }

  listaGenerosSessoes.innerHTML = generosDisponiveis
    .map(
      (genero, index) => `
        <button class="btn btn-outline-primary text-start" type="button" data-genero-index="${index}">
            ${escapeHTML(genero)}
        </button>
    `,
    )
    .join("");
}

function renderizarRelatorioSessoesPorFilme(idFilme) {
  const filmeSelecionado = filmes.find(
    (filme) => Number(filme.id_filme) === Number(idFilme),
  );

  const sessoesFiltradas = sessoes.filter((sessao) => {
    const idSessaoFilme = sessao.id_filme ?? sessao.filmes?.id_filme;
    return Number(idSessaoFilme) === Number(idFilme);
  });

  const linhas = sessoesFiltradas.map((sessao) => {
    const ingressosVendidos = Number(sessao.ingressos_vendidos ?? 0);
    const preco = Number(sessao.preco ?? 0);
    const faturamentoEstimado = preco * ingressosVendidos;

    return [
      sessao.id_sessao,
      escapeHTML(
        sessao.filmes?.titulo ??
          filmeSelecionado?.titulo ??
          "Filme não encontrado",
      ),
      formatarDataHora(sessao.data_hora),
      Number(sessao.sala),
      formatarMoeda(preco),
      ingressosVendidos,
      formatarMoeda(faturamentoEstimado),
    ];
  });

  renderizarTabelaRelatorioSessoes(
    `Sessões do filme: ${filmeSelecionado?.titulo ?? "Filme selecionado"}`,
    `Total encontrado: ${sessoesFiltradas.length}.`,
    [
      "ID",
      "Filme",
      "Data/Hora",
      "Sala",
      "Preço",
      "Ingressos",
      "Faturamento estimado",
    ],
    linhas,
  );
}

async function consultarSessoesPorData(dataInicio, dataFim) {
  let consulta = supabase
    .from("sessoes")
    .select("id_sessao, id_filme, data_hora, sala, preco, ingressos_vendidos")
    .order("data_hora", { ascending: true });

  if (dataInicio) {
    consulta = consulta.gte("data_hora", dataInicio);
  }

  if (dataFim) {
    consulta = consulta.lte("data_hora", dataFim);
  }

  const { data, error } = await consulta;

  if (error) throw error;
  return data ?? [];
}

async function consultarSessoesPorSala(sala) {
  const { data, error } = await supabase
    .from("sessoes")
    .select("id_sessao, id_filme, data_hora, sala, preco, ingressos_vendidos")
    .eq("sala", sala)
    .order("data_hora", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

async function consultarSessoesPorPreco(precoMaximo) {
  const { data, error } = await supabase
    .from("sessoes")
    .select("id_sessao, id_filme, data_hora, sala, preco, ingressos_vendidos")
    .lte("preco", precoMaximo)
    .order("preco", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

async function consultarSessoesPorGenero(genero) {
  const { data, error } = await supabase
    .from("sessoes")
    .select(
      `
            id_sessao,
            data_hora,
            sala,
            preco,
            ingressos_vendidos,
            filmes!inner (
                titulo,
                genero,
                classificacao
            )
        `,
    )
    .eq("filmes.genero", genero)
    .order("data_hora", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

async function relatorioSessoesPorGenero(genero) {
  modalGenerosSessoes.hide();
  mostrarMensagemRelatorio(
    `Sessões do gênero: ${genero}`,
    "Carregando relatório...",
  );

  try {
    const sessoesFiltradas = await consultarSessoesPorGenero(genero);

    const linhas = sessoesFiltradas.map((sessao) => [
      sessao.id_sessao,
      escapeHTML(sessao.filmes?.titulo ?? "Filme não encontrado"),
      escapeHTML(sessao.filmes?.genero ?? ""),
      escapeHTML(sessao.filmes?.classificacao ?? ""),
      formatarDataHora(sessao.data_hora),
      Number(sessao.sala),
      formatarMoeda(sessao.preco),
      Number(sessao.ingressos_vendidos ?? 0),
    ]);

    renderizarTabelaRelatorioSessoes(
      `Sessões do gênero: ${genero}`,
      `Total encontrado: ${sessoesFiltradas.length}.`,
      [
        "ID",
        "Filme",
        "Gênero",
        "Classificação",
        "Data/Hora",
        "Sala",
        "Preço",
        "Ingressos",
      ],
      linhas,
    );
  } catch (erro) {
    mostrarErro(erro, "Não foi possível consultar sessões por gênero");
    mostrarMensagemRelatorio(
      `Sessões do gênero: ${genero}`,
      "Erro ao gerar relatório.",
    );
  }
}

async function relatorioSessoesSemVenda() {
  modalConsultaSessoes.hide();
  mostrarMensagemRelatorio("Sessões sem venda", "Carregando relatório...");

  try {
    const { data, error } = await supabase
      .from("sessoes")
      .select(
        `
                id_sessao,
                data_hora,
                sala,
                preco,
                ingressos_vendidos,
                filmes (
                    titulo,
                    genero,
                    classificacao
                )
            `,
      )
      .eq("ingressos_vendidos", 0)
      .order("data_hora", { ascending: true });

    if (error) throw error;

    const linhas = (data ?? []).map((sessao) => [
      sessao.id_sessao,
      escapeHTML(sessao.filmes?.titulo ?? "Filme não encontrado"),
      escapeHTML(sessao.filmes?.genero ?? ""),
      escapeHTML(sessao.filmes?.classificacao ?? ""),
      formatarDataHora(sessao.data_hora),
      Number(sessao.sala),
      formatarMoeda(sessao.preco),
      Number(sessao.ingressos_vendidos ?? 0),
    ]);

    renderizarTabelaRelatorioSessoes(
      "Sessões sem venda",
      `Total encontrado: ${(data ?? []).length}.`,
      [
        "ID",
        "Filme",
        "Gênero",
        "Classificação",
        "Data/Hora",
        "Sala",
        "Preço",
        "Ingressos",
      ],
      linhas,
    );
  } catch (erro) {
    mostrarErro(erro, "Não foi possível consultar sessões sem venda");
    mostrarMensagemRelatorio("Sessões sem venda", "Erro ao gerar relatório.");
  }
}

async function relatorioSessoesMaisVendidas() {
  modalConsultaSessoes.hide();
  mostrarMensagemRelatorio(
    "Sessões com maior faturamento",
    "Carregando relatório...",
  );

  try {
    const { data, error } = await supabase.from("ingressos").select(`
                valor_pago,
                sessoes (
                    id_sessao,
                    data_hora,
                    sala,
                    preco,
                    ingressos_vendidos,
                    filmes (
                        titulo
                    )
                )
            `);

    if (error) throw error;

    const agrupado = {};

    (data ?? []).forEach((ingresso) => {
      const sessao = ingresso.sessoes;
      if (!sessao?.id_sessao) return;

      if (!agrupado[sessao.id_sessao]) {
        agrupado[sessao.id_sessao] = {
          ...sessao,
          quantidadeIngressos: 0,
          faturamento: 0,
        };
      }

      agrupado[sessao.id_sessao].quantidadeIngressos += 1;
      agrupado[sessao.id_sessao].faturamento += Number(
        ingresso.valor_pago ?? 0,
      );
    });

    const sessoesMaisVendidas = Object.values(agrupado).sort((a, b) => {
      if (b.faturamento !== a.faturamento) {
        return b.faturamento - a.faturamento;
      }

      return b.quantidadeIngressos - a.quantidadeIngressos;
    });

    const linhas = sessoesMaisVendidas.map((sessao, index) => [
      index + 1,
      sessao.id_sessao,
      escapeHTML(sessao.filmes?.titulo ?? "Filme não encontrado"),
      formatarDataHora(sessao.data_hora),
      Number(sessao.sala),
      formatarMoeda(sessao.preco),
      sessao.quantidadeIngressos,
      formatarMoeda(sessao.faturamento),
    ]);

    renderizarTabelaRelatorioSessoes(
      "Sessões com maior faturamento",
      "Ranking por faturamento total.",
      [
        "Posição",
        "ID",
        "Filme",
        "Data/Hora",
        "Sala",
        "Preço",
        "Ingressos",
        "Faturamento",
      ],
      linhas,
    );
  } catch (erro) {
    mostrarErro(
      erro,
      "Não foi possível gerar o relatório de sessões com maior faturamento",
    );
    mostrarMensagemRelatorio(
      "Sessões com maior faturamento",
      "Erro ao gerar relatório.",
    );
  }
}

modalEl.addEventListener("show.bs.modal", (event) => {
  if (event.relatedTarget?.dataset.acao === "novo") {
    limparFormulario();
  }
});

tabela.addEventListener("click", async (event) => {
  const botao = event.target.closest("button[data-acao]");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const acao = botao.dataset.acao;

  if (acao === "editar") {
    const sessao = sessoes.find((item) => Number(item.id_sessao) === id);

    if (!sessao) {
      alert("Sessão não encontrada na lista atual.");
      return;
    }

    preencherFormulario(sessao);
    modal.show();
    return;
  }

  if (acao === "excluir") {
    const confirmar = confirm(
      "Tem certeza que deseja excluir esta sessão? Se ela tiver ingressos vinculados, o banco pode bloquear a exclusão.",
    );
    if (!confirmar) return;

    try {
      await excluirSessao(id);
      await carregarSessoes();
    } catch (erro) {
      mostrarErro(erro, "Não foi possível excluir a sessão");
    }
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = document.getElementById("idSessao").value;

  const dados = {
    id_filme: Number(selectFilme.value),
    data_hora: document.getElementById("dataHora").value,
    sala: Number(document.getElementById("sala").value),
    preco: Number(document.getElementById("preco").value),
    ingressos_vendidos: Number(document.getElementById("ingressos").value),
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

btnAbrirConsultaSessoesPorFilme.addEventListener("click", () => {
  prepararModalFilmesSessoes();
  abrirModalDepoisDeFechar(
    modalConsultaSessoesEl,
    modalConsultaSessoes,
    modalFilmesSessoes,
  );
});

btnAbrirConsultaSessoesPorData.addEventListener("click", () => {
  dataInicioSessoes.value = "";
  dataFimSessoes.value = "";
  abrirModalDepoisDeFechar(
    modalConsultaSessoesEl,
    modalConsultaSessoes,
    modalDataSessoes,
  );
});

btnAbrirConsultaSessoesPorSala.addEventListener("click", () => {
  inputSalaSessoes.value = "";
  abrirModalDepoisDeFechar(
    modalConsultaSessoesEl,
    modalConsultaSessoes,
    modalSalaSessoes,
  );
});

btnAbrirConsultaSessoesPorPreco.addEventListener("click", () => {
  inputPrecoMaximoSessoes.value = "";
  abrirModalDepoisDeFechar(
    modalConsultaSessoesEl,
    modalConsultaSessoes,
    modalPrecoSessoes,
  );
});

btnAbrirConsultaSessoesPorGenero.addEventListener("click", () => {
  prepararModalGenerosSessoes();
  abrirModalDepoisDeFechar(
    modalConsultaSessoesEl,
    modalConsultaSessoes,
    modalGenerosSessoes,
  );
});

btnConsultaSessoesSemVenda.addEventListener("click", relatorioSessoesSemVenda);

btnConsultaSessoesMaisVendidas.addEventListener(
  "click",
  relatorioSessoesMaisVendidas,
);

listaFilmesSessoes.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-id-filme]");
  if (!botao) return;

  const idFilme = Number(botao.dataset.idFilme);
  modalFilmesSessoes.hide();
  renderizarRelatorioSessoesPorFilme(idFilme);
});

listaGenerosSessoes.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-genero-index]");
  if (!botao) return;

  const genero = generosDisponiveis[Number(botao.dataset.generoIndex)];
  relatorioSessoesPorGenero(genero);
});

formConsultaDataSessoes.addEventListener("submit", async (event) => {
  event.preventDefault();

  const inicio = dataInicioSessoes.value;
  const fim = dataFimSessoes.value;

  if (!inicio && !fim) {
    alert("Informe pelo menos uma data para realizar a consulta.");
    return;
  }

  modalDataSessoes.hide();
  mostrarMensagemRelatorio(
    "Sessões por intervalo de data",
    "Carregando relatório...",
  );

  try {
    const resultado = await consultarSessoesPorData(inicio, fim);

    renderizarTabelaRelatorioSessoes(
      "Sessões por intervalo de data",
      `Total encontrado: ${resultado.length}.`,
      ["ID", "ID Filme", "Data/Hora", "Sala", "Preço", "Ingressos"],
      linhasSessoesTabelaUnica(resultado),
    );
  } catch (erro) {
    mostrarErro(erro, "Não foi possível consultar sessões por data");
    mostrarMensagemRelatorio(
      "Sessões por intervalo de data",
      "Erro ao gerar relatório.",
    );
  }
});

formConsultaSalaSessoes.addEventListener("submit", async (event) => {
  event.preventDefault();

  const sala = Number(inputSalaSessoes.value);

  modalSalaSessoes.hide();
  mostrarMensagemRelatorio(
    `Sessões da sala ${sala}`,
    "Carregando relatório...",
  );

  try {
    const resultado = await consultarSessoesPorSala(sala);

    renderizarTabelaRelatorioSessoes(
      `Sessões da sala ${sala}`,
      `Total encontrado: ${resultado.length}.`,
      ["ID", "ID Filme", "Data/Hora", "Sala", "Preço", "Ingressos"],
      linhasSessoesTabelaUnica(resultado),
    );
  } catch (erro) {
    mostrarErro(erro, "Não foi possível consultar sessões por sala");
    mostrarMensagemRelatorio(
      `Sessões da sala ${sala}`,
      "Erro ao gerar relatório.",
    );
  }
});

formConsultaPrecoSessoes.addEventListener("submit", async (event) => {
  event.preventDefault();

  const precoMaximo = Number(inputPrecoMaximoSessoes.value);

  modalPrecoSessoes.hide();
  mostrarMensagemRelatorio(
    `Sessões até ${formatarMoeda(precoMaximo)}`,
    "Carregando relatório...",
  );

  try {
    const resultado = await consultarSessoesPorPreco(precoMaximo);

    renderizarTabelaRelatorioSessoes(
      `Sessões até ${formatarMoeda(precoMaximo)}`,
      `Total encontrado: ${resultado.length}.`,
      ["ID", "ID Filme", "Data/Hora", "Sala", "Preço", "Ingressos"],
      linhasSessoesTabelaUnica(resultado),
    );
  } catch (erro) {
    mostrarErro(erro, "Não foi possível consultar sessões por preço");
    mostrarMensagemRelatorio(
      `Sessões até ${formatarMoeda(precoMaximo)}`,
      "Erro ao gerar relatório.",
    );
  }
});

btnLimparRelatorioSessoes.addEventListener("click", () => {
  cardRelatorioSessoes.classList.add("d-none");
  resultadoRelatorioSessoes.innerHTML = "";
  tituloRelatorioSessoes.textContent = "Resultado da consulta";
  subtituloRelatorioSessoes.textContent = "";
});

await carregarFilmesSelect();
await carregarSessoes();
