import "./layout.js";

import { supabase } from "./supabaseClient.js";
import { escapeHTML, formatarMoeda, mostrarErro } from "./ui.js";

const resultado = document.getElementById("resultado");

function setCarregando() {
    resultado.innerHTML = `<p class="text-muted">Carregando relatório...</p>`;
}

function setVazio(mensagem = "Nenhum resultado encontrado.") {
    resultado.innerHTML = `<p class="text-muted">${escapeHTML(mensagem)}</p>`;
}

function mostrarTabela(colunas, linhas) {
    if (linhas.length === 0) {
        setVazio();
        return;
    }

    resultado.innerHTML = `
        <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        ${colunas.map(coluna => `<th>${escapeHTML(coluna)}</th>`).join("")}
                    </tr>
                </thead>
                <tbody>
                    ${linhas.map(linha => `
                        <tr>
                            ${linha.map(celula => `<td>${celula}</td>`).join("")}
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

async function relatorioFaturamento() {
    setCarregando();

    try {
        const { data, error } = await supabase
            .from("ingressos")
            .select(`
                valor_pago,
                sessoes (
                    filmes (
                        titulo
                    )
                )
            `);

        if (error) throw error;

        const agrupado = {};

        (data ?? []).forEach(item => {
            const filme = item.sessoes?.filmes?.titulo ?? "Filme não encontrado";
            agrupado[filme] = (agrupado[filme] ?? 0) + Number(item.valor_pago ?? 0);
        });

        const linhas = Object.entries(agrupado)
            .sort((a, b) => b[1] - a[1])
            .map(([filme, total]) => [escapeHTML(filme), formatarMoeda(total)]);

        mostrarTabela(["Filme", "Faturamento total"], linhas);
    } catch (erro) {
        mostrarErro(erro, "Erro no relatório de faturamento");
        setVazio("Não foi possível gerar o relatório.");
    }
}

async function relatorioTopFilmes() {
    setCarregando();

    try {
        const { data, error } = await supabase
            .from("ingressos")
            .select(`
                id_ingresso,
                sessoes (
                    filmes (
                        titulo
                    )
                )
            `);

        if (error) throw error;

        const ranking = {};

        (data ?? []).forEach(item => {
            const filme = item.sessoes?.filmes?.titulo ?? "Filme não encontrado";
            ranking[filme] = (ranking[filme] ?? 0) + 1;
        });

        const linhas = Object.entries(ranking)
            .sort((a, b) => b[1] - a[1])
            .map(([filme, quantidade], index) => [index + 1, escapeHTML(filme), quantidade]);

        mostrarTabela(["Posição", "Filme", "Ingressos vendidos"], linhas);
    } catch (erro) {
        mostrarErro(erro, "Erro no ranking de filmes");
        setVazio("Não foi possível gerar o relatório.");
    }
}

async function relatorioClassificacao() {
    setCarregando();

    try {
        const { data, error } = await supabase
            .from("filmes")
            .select("titulo, genero, classificacao")
            .in("classificacao", ["12", "14", "16"])
            .order("classificacao", { ascending: true });

        if (error) throw error;

        const linhas = (data ?? []).map(filme => [
            escapeHTML(filme.titulo),
            escapeHTML(filme.genero),
            escapeHTML(filme.classificacao)
        ]);

        mostrarTabela(["Título", "Gênero", "Classificação"], linhas);
    } catch (erro) {
        mostrarErro(erro, "Erro no relatório por classificação");
        setVazio("Não foi possível gerar o relatório.");
    }
}

document.getElementById("btnFaturamento").addEventListener("click", relatorioFaturamento);
document.getElementById("btnTopFilmes").addEventListener("click", relatorioTopFilmes);
document.getElementById("btnClassificacao").addEventListener("click", relatorioClassificacao);

setVazio("Escolha um relatório acima para executar.");
