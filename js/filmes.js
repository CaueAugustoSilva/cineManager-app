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
const modalGenerosFilmesEl = document.getElementById("modalGenerosFilmes");
const modalGenerosFilmes = new bootstrap.Modal(modalGenerosFilmesEl);

const listaGenerosFilmes = document.getElementById("listaGenerosFilmes");
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
const btnAbrirConsultaGenero = document.getElementById(
  "btnAbrirConsultaGenero",
);
const btnConsultaFilmesMaisVendidos = document.getElementById(
  "btnConsultaFilmesMaisVendidos",
);

let filmes = [];

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
                    <button class="btn btn-warning btn-sm" data-acao="editar" data-id="${filme.id_filme}">Editar</button>
                    <button class="btn btn-danger btn-sm" data-acao="excluir" data-id="${filme.id_filme}">Excluir</button>
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

function renderizarRelatorioPorGenero(generoSelecionado) {
  const filmesFiltrados = filmes.filter(
    (filme) => filme.genero === generoSelecionado,
  );

  const linhas = filmesFiltrados.map((filme) => [
    filme.id_filme,
    escapeHTML(filme.titulo),
    escapeHTML(filme.genero),
    `${Number(filme.duracao)} min`,
    escapeHTML(filme.classificacao),
    escapeHTML(filme.diretor),
  ]);

  renderizarTabelaRelatorioFilmes(
    `Filmes do gênero: ${generoSelecionado}`,
    `Total encontrado: ${filmesFiltrados.length}`,
    ["ID", "Título", "Gênero", "Duração", "Classificação", "Diretor"],
    linhas,
  );
}

function prepararModalGeneros() {
  const generos = [
    ...new Set(filmes.map((filme) => filme.genero).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  if (generos.length === 0) {
    listaGenerosFilmes.innerHTML = `<p class="text-muted mb-0">Nenhum gênero cadastrado no sistema.</p>`;
    return;
  }

  listaGenerosFilmes.innerHTML = generos
    .map(
      (genero) => `
        <button class="btn btn-outline-dark text-start" type="button" data-genero="${escapeHTML(genero)}">
            ${escapeHTML(genero)}
        </button>
    `,
    )
    .join("");
}

async function relatorioFilmesMaisVendidos() {
  modalConsultaFilmes.hide();
  mostrarMensagemRelatorio("Filmes Mais Vendidos", "Carregando relatório...");

  try {
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

    const filmesMaisVendidos = Object.values(agrupado)
      .filter((filme) => filme.faturamento > 1000)
      .sort((a, b) => b.faturamento - a.faturamento);

    const linhas = filmesMaisVendidos.map((filme) => [
      filme.id_filme,
      escapeHTML(filme.titulo),
      escapeHTML(filme.genero),
      `${Number(filme.duracao)} min`,
      escapeHTML(filme.classificacao),
      escapeHTML(filme.diretor),
      filme.quantidadeIngressos,
      formatarMoeda(filme.faturamento),
    ]);

    renderizarTabelaRelatorioFilmes(
      "Filmes Mais Vendidos",
      "Filtro aplicado: filmes com faturamento acima de R$ 1.000,00.",
      [
        "ID",
        "Título",
        "Gênero",
        "Duração",
        "Classificação",
        "Diretor",
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
      "Filmes Mais Vendidos",
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

btnAbrirConsultaGenero.addEventListener("click", () => {
  prepararModalGeneros();

  modalConsultaFilmesEl.addEventListener(
    "hidden.bs.modal",
    () => {
      modalGenerosFilmes.show();
    },
    { once: true },
  );

  modalConsultaFilmes.hide();
});

btnConsultaFilmesMaisVendidos.addEventListener(
  "click",
  relatorioFilmesMaisVendidos,
);

listaGenerosFilmes.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-genero]");
  if (!botao) return;

  const genero = botao.dataset.genero;
  modalGenerosFilmes.hide();
  renderizarRelatorioPorGenero(genero);
});

btnLimparRelatorioFilmes.addEventListener("click", () => {
  cardRelatorioFilmes.classList.add("d-none");
  resultadoRelatorioFilmes.innerHTML = "";
  tituloRelatorioFilmes.textContent = "Resultado da consulta";
  subtituloRelatorioFilmes.textContent = "";
});

carregarFilmes();
