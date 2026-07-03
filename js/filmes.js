import "./layout.js";

import { supabase } from "./supabaseClient.js";

import {
  obterFilmes,
  cadastrarFilme,
  atualizarFilme,
  excluirFilme,
} from "./supabaseService.js";

import {
  escapeHTML,
  formatarMoeda,
  setLinhaCarregando,
  setLinhaVazia,
  mostrarErro,
} from "./ui.js";

const tabela = document.getElementById("tabelaFilmes");
const form = document.getElementById("formFilme");
const modalEl = document.getElementById("modalFilme");
const modal = new bootstrap.Modal(modalEl);
const tituloModal = document.getElementById("tituloModalFilme");

const modalConsultaFilmesEl = document.getElementById("modalConsultaFilmes");
const modalConsultaFilmes = new bootstrap.Modal(modalConsultaFilmesEl);

const modalBuscaTituloFilmesEl = document.getElementById(
  "modalBuscaTituloFilmes",
);
const modalBuscaTituloFilmes = new bootstrap.Modal(modalBuscaTituloFilmesEl);

const modalGenerosFilmesEl = document.getElementById("modalGenerosFilmes");
const modalGenerosFilmes = new bootstrap.Modal(modalGenerosFilmesEl);

const modalClassificacaoFilmesEl = document.getElementById(
  "modalClassificacaoFilmes",
);
const modalClassificacaoFilmes = new bootstrap.Modal(
  modalClassificacaoFilmesEl,
);

const formBuscaTituloFilmes = document.getElementById("formBuscaTituloFilmes");
const inputTituloFilmeConsulta = document.getElementById(
  "inputTituloFilmeConsulta",
);

const listaGenerosFilmes = document.getElementById("listaGenerosFilmes");
const listaClassificacoesFilmes = document.getElementById(
  "listaClassificacoesFilmes",
);

const cardRelatorioFilmes = document.getElementById("cardRelatorioFilmes");
const tituloRelatorioFilmes = document.getElementById("tituloRelatorioFilmes");
const subtituloRelatorioFilmes = document.getElementById(
  "subtituloRelatorioFilmes",
);
const resultadoRelatorioFilmes = document.getElementById(
  "resultadoRelatorioFilmes",
);
const btnLimparRelatorioFilmes = document.getElementById(
  "btnLimparRelatorioFilmes",
);

const btnAbrirBuscaTituloFilmes = document.getElementById(
  "btnAbrirBuscaTituloFilmes",
);
const btnAbrirConsultaGenero = document.getElementById(
  "btnAbrirConsultaGenero",
);
const btnAbrirConsultaClassificacaoFilmes = document.getElementById(
  "btnAbrirConsultaClassificacaoFilmes",
);
const btnConsultaFilmesMaisVendidos = document.getElementById(
  "btnConsultaFilmesMaisVendidos",
);
const btnConsultaFilmesMaiorFaturamento = document.getElementById(
  "btnConsultaFilmesMaiorFaturamento",
);

let filmes = [];
let generosDisponiveis = [];
let classificacoesDisponiveis = [];

async function carregarFilmes() {
  setLinhaCarregando(tabela, 7);

  try {
    filmes = await obterFilmes();

    if (filmes.length === 0) {
      setLinhaVazia(tabela, 7, "Nenhum filme cadastrado.");
      return;
    }

    tabela.innerHTML = filmes
      .map(
        (filme) => `
            <tr>
                <td>${filme.id_filme}</td>
                <td>${escapeHTML(filme.titulo)}</td>
                <td>${escapeHTML(filme.genero)}</td>
                <td>${Number(filme.duracao)} min</td>
                <td>${escapeHTML(filme.classificacao)}</td>
                <td>${escapeHTML(filme.diretor)}</td>
                <td>
                    <div class="acoes-tabela">
                        <button 
                            class="btn-acao btn-editar" 
                            data-acao="editar" 
                            data-id="${filme.id_filme}"
                            title="Editar filme"
                            aria-label="Editar filme">
                            <span class="icone-acao">✎</span>
                        </button>

                        <button 
                            class="btn-acao btn-excluir" 
                            data-acao="excluir" 
                            data-id="${filme.id_filme}"
                            title="Excluir filme"
                            aria-label="Excluir filme">
                            <span class="icone-excluir">×</span>
                        </button>
                    </div>
                </td>
            </tr>
        `,
      )
      .join("");
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
  cardRelatorioFilmes.classList.remove("d-none");
  tituloRelatorioFilmes.textContent = titulo;
  subtituloRelatorioFilmes.textContent = "";
  resultadoRelatorioFilmes.innerHTML = `<p class="text-muted mb-0">${escapeHTML(mensagem)}</p>`;
  cardRelatorioFilmes.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderizarTabelaRelatorioFilmes(titulo, subtitulo, colunas, linhas) {
  cardRelatorioFilmes.classList.remove("d-none");
  tituloRelatorioFilmes.textContent = titulo;
  subtituloRelatorioFilmes.textContent = subtitulo;

  if (linhas.length === 0) {
    resultadoRelatorioFilmes.innerHTML = `<p class="text-muted mb-0">Nenhum filme encontrado para esta consulta.</p>`;
    cardRelatorioFilmes.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  resultadoRelatorioFilmes.innerHTML = `
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

  cardRelatorioFilmes.scrollIntoView({ behavior: "smooth", block: "start" });
}

function linhasRelatorioFilmes(listaFilmes) {
  return listaFilmes.map((filme) => [
    filme.id_filme,
    escapeHTML(filme.titulo),
    escapeHTML(filme.genero),
    `${Number(filme.duracao)} min`,
    escapeHTML(filme.classificacao),
    escapeHTML(filme.diretor),
  ]);
}

function prepararModalGeneros() {
  generosDisponiveis = [
    ...new Set(filmes.map((filme) => filme.genero).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  if (generosDisponiveis.length === 0) {
    listaGenerosFilmes.innerHTML = `<p class="text-muted mb-0">Nenhum gênero cadastrado no sistema.</p>`;
    return;
  }

  listaGenerosFilmes.innerHTML = generosDisponiveis
    .map(
      (genero, index) => `
        <button class="btn btn-outline-primary text-start" type="button" data-genero-index="${index}">
            ${escapeHTML(genero)}
        </button>
    `,
    )
    .join("");
}

function prepararModalClassificacoes() {
  const ordem = ["Livre", "10", "12", "14", "16", "18"];

  classificacoesDisponiveis = [
    ...new Set(filmes.map((filme) => filme.classificacao).filter(Boolean)),
  ].sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b));

  if (classificacoesDisponiveis.length === 0) {
    listaClassificacoesFilmes.innerHTML = `<p class="text-muted mb-0">Nenhuma classificação encontrada no sistema.</p>`;
    return;
  }

  listaClassificacoesFilmes.innerHTML = classificacoesDisponiveis
    .map(
      (classificacao, index) => `
        <button class="btn btn-outline-primary text-start" type="button" data-classificacao-index="${index}">
            ${escapeHTML(classificacao)}
        </button>
    `,
    )
    .join("");
}

function renderizarRelatorioPorGenero(generoSelecionado) {
  const filmesFiltrados = filmes.filter(
    (filme) => filme.genero === generoSelecionado,
  );

  renderizarTabelaRelatorioFilmes(
    `Filmes do gênero: ${generoSelecionado}`,
    `Total encontrado: ${filmesFiltrados.length}.`,
    ["ID", "Título", "Gênero", "Duração", "Classificação", "Diretor"],
    linhasRelatorioFilmes(filmesFiltrados),
  );
}

function renderizarRelatorioPorClassificacao(classificacaoSelecionada) {
  const filmesFiltrados = filmes.filter(
    (filme) => filme.classificacao === classificacaoSelecionada,
  );

  renderizarTabelaRelatorioFilmes(
    `Filmes com classificação: ${classificacaoSelecionada}`,
    `Total encontrado: ${filmesFiltrados.length}.`,
    ["ID", "Título", "Gênero", "Duração", "Classificação", "Diretor"],
    linhasRelatorioFilmes(filmesFiltrados),
  );
}

async function obterRankingFilmesPorIngressos() {
  const { data, error } = await supabase.from("ingressos").select(`
            valor_pago,
            sessoes (
                filmes (
                    id_filme,
                    titulo,
                    genero,
                    duracao,
                    classificacao,
                    diretor
                )
            )
        `);

  if (error) throw error;

  const agrupado = {};

  (data ?? []).forEach((ingresso) => {
    const filme = ingresso.sessoes?.filmes;
    if (!filme?.id_filme) return;

    if (!agrupado[filme.id_filme]) {
      agrupado[filme.id_filme] = {
        ...filme,
        quantidadeIngressos: 0,
        faturamento: 0,
      };
    }

    agrupado[filme.id_filme].quantidadeIngressos += 1;
    agrupado[filme.id_filme].faturamento += Number(ingresso.valor_pago ?? 0);
  });

  return Object.values(agrupado);
}

async function relatorioFilmesMaisVendidos() {
  modalConsultaFilmes.hide();
  mostrarMensagemRelatorio("Filmes mais vendidos", "Carregando relatório...");

  try {
    const ranking = await obterRankingFilmesPorIngressos();

    const filmesMaisVendidos = ranking.sort((a, b) => {
      if (b.quantidadeIngressos !== a.quantidadeIngressos) {
        return b.quantidadeIngressos - a.quantidadeIngressos;
      }

      return b.faturamento - a.faturamento;
    });

    const linhas = filmesMaisVendidos.map((filme, index) => [
      index + 1,
      filme.id_filme,
      escapeHTML(filme.titulo),
      escapeHTML(filme.genero),
      `${Number(filme.duracao)} min`,
      escapeHTML(filme.classificacao),
      filme.quantidadeIngressos,
      formatarMoeda(filme.faturamento),
    ]);

    renderizarTabelaRelatorioFilmes(
      "Filmes mais vendidos",
      "Ranking por quantidade de ingressos vendidos.",
      [
        "Posição",
        "ID",
        "Título",
        "Gênero",
        "Duração",
        "Classificação",
        "Ingressos",
        "Faturamento",
      ],
      linhas,
    );
  } catch (erro) {
    mostrarErro(
      erro,
      "Não foi possível gerar o relatório de filmes mais vendidos",
    );
    mostrarMensagemRelatorio(
      "Filmes mais vendidos",
      "Erro ao gerar relatório.",
    );
  }
}

async function relatorioFilmesMaiorFaturamento() {
  modalConsultaFilmes.hide();
  mostrarMensagemRelatorio(
    "Filmes com maior faturamento",
    "Carregando relatório...",
  );

  try {
    const ranking = await obterRankingFilmesPorIngressos();

    const filmesMaiorFaturamento = ranking.sort((a, b) => {
      if (b.faturamento !== a.faturamento) {
        return b.faturamento - a.faturamento;
      }

      return b.quantidadeIngressos - a.quantidadeIngressos;
    });

    const linhas = filmesMaiorFaturamento.map((filme, index) => [
      index + 1,
      filme.id_filme,
      escapeHTML(filme.titulo),
      escapeHTML(filme.genero),
      escapeHTML(filme.diretor),
      filme.quantidadeIngressos,
      formatarMoeda(filme.faturamento),
    ]);

    renderizarTabelaRelatorioFilmes(
      "Filmes com maior faturamento",
      "Ranking por faturamento total.",
      [
        "Posição",
        "ID",
        "Título",
        "Gênero",
        "Diretor",
        "Ingressos",
        "Faturamento",
      ],
      linhas,
    );
  } catch (erro) {
    mostrarErro(
      erro,
      "Não foi possível gerar o relatório de faturamento dos filmes",
    );
    mostrarMensagemRelatorio(
      "Filmes com maior faturamento",
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
    const filme = filmes.find((item) => Number(item.id_filme) === id);

    if (!filme) {
      alert("Filme não encontrado na lista atual.");
      return;
    }

    preencherFormulario(filme);
    modal.show();
    return;
  }

  if (acao === "excluir") {
    const confirmar = confirm(
      "Tem certeza que deseja excluir este filme? Se ele tiver sessões vinculadas, o banco pode bloquear a exclusão.",
    );
    if (!confirmar) return;

    try {
      await excluirFilme(id);
      await carregarFilmes();
    } catch (erro) {
      mostrarErro(erro, "Não foi possível excluir o filme");
    }
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = document.getElementById("idFilme").value;

  const dados = {
    titulo: document.getElementById("titulo").value.trim(),
    genero: document.getElementById("genero").value.trim(),
    duracao: Number(document.getElementById("duracao").value),
    classificacao: document.getElementById("classificacao").value,
    diretor: document.getElementById("diretor").value.trim(),
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

btnAbrirBuscaTituloFilmes.addEventListener("click", () => {
  inputTituloFilmeConsulta.value = "";
  abrirModalDepoisDeFechar(
    modalConsultaFilmesEl,
    modalConsultaFilmes,
    modalBuscaTituloFilmes,
  );
});

formBuscaTituloFilmes.addEventListener("submit", (event) => {
  event.preventDefault();

  const termo = inputTituloFilmeConsulta.value.trim().toLowerCase();

  const filmesFiltrados = filmes.filter((filme) => {
    return filme.titulo.toLowerCase().includes(termo);
  });

  modalBuscaTituloFilmes.hide();

  renderizarTabelaRelatorioFilmes(
    `Busca por título: "${inputTituloFilmeConsulta.value.trim()}"`,
    `Total encontrado: ${filmesFiltrados.length}.`,
    ["ID", "Título", "Gênero", "Duração", "Classificação", "Diretor"],
    linhasRelatorioFilmes(filmesFiltrados),
  );
});

btnAbrirConsultaGenero.addEventListener("click", () => {
  prepararModalGeneros();
  abrirModalDepoisDeFechar(
    modalConsultaFilmesEl,
    modalConsultaFilmes,
    modalGenerosFilmes,
  );
});

btnAbrirConsultaClassificacaoFilmes.addEventListener("click", () => {
  prepararModalClassificacoes();
  abrirModalDepoisDeFechar(
    modalConsultaFilmesEl,
    modalConsultaFilmes,
    modalClassificacaoFilmes,
  );
});

btnConsultaFilmesMaisVendidos.addEventListener(
  "click",
  relatorioFilmesMaisVendidos,
);

btnConsultaFilmesMaiorFaturamento.addEventListener(
  "click",
  relatorioFilmesMaiorFaturamento,
);

listaGenerosFilmes.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-genero-index]");
  if (!botao) return;

  const genero = generosDisponiveis[Number(botao.dataset.generoIndex)];
  modalGenerosFilmes.hide();
  renderizarRelatorioPorGenero(genero);
});

listaClassificacoesFilmes.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-classificacao-index]");
  if (!botao) return;

  const classificacao =
    classificacoesDisponiveis[Number(botao.dataset.classificacaoIndex)];
  modalClassificacaoFilmes.hide();
  renderizarRelatorioPorClassificacao(classificacao);
});

btnLimparRelatorioFilmes.addEventListener("click", () => {
  cardRelatorioFilmes.classList.add("d-none");
  resultadoRelatorioFilmes.innerHTML = "";
  tituloRelatorioFilmes.textContent = "Resultado da consulta";
  subtituloRelatorioFilmes.textContent = "";
});

carregarFilmes();
