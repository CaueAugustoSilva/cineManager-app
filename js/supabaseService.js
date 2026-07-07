import { supabase } from "./supabaseClient.js";

function tratarErro(error, contexto) {
  if (error) {
    throw new Error(`${contexto}: ${error.message}`);
  }
}

/* =========================
   FILMES
========================= */
export async function obterFilmes() {
  const { data, error } = await supabase
    .from("filmes")
    .select("*")
    .order("id_filme", { ascending: true });

  tratarErro(error, "Erro ao buscar filmes");
  return data ?? [];
}

export async function cadastrarFilme(filme) {
  const { data, error } = await supabase
    .from("filmes")
    .insert([filme])
    .select()
    .single();

  tratarErro(error, "Erro ao cadastrar filme");
  return data;
}

export async function atualizarFilme(id, dados) {
  const { data, error } = await supabase
    .from("filmes")
    .update(dados)
    .eq("id_filme", id)
    .select()
    .single();

  tratarErro(error, "Erro ao atualizar filme");
  return data;
}

export async function excluirFilme(id) {
  const { error } = await supabase.from("filmes").delete().eq("id_filme", id);

  tratarErro(error, "Erro ao excluir filme");
  return true;
}

/* =========================
   SESSÕES
========================= */
export async function obterSessoes() {
  const { data, error } = await supabase
    .from("sessoes")
    .select(
      `
            id_sessao,
            id_filme,
            data_hora,
            sala,
            preco,
            ingressos_vendidos,
            filmes (
                id_filme,
                titulo
            )
        `,
    )
    .order("data_hora", { ascending: true });

  tratarErro(error, "Erro ao buscar sessões");
  return data ?? [];
}

export async function cadastrarSessao(sessao) {
  const { data, error } = await supabase
    .from("sessoes")
    .insert([sessao])
    .select()
    .single();

  tratarErro(error, "Erro ao cadastrar sessão");
  return data;
}

export async function atualizarSessao(id, dados) {
  const { data, error } = await supabase
    .from("sessoes")
    .update(dados)
    .eq("id_sessao", id)
    .select()
    .single();

  tratarErro(error, "Erro ao atualizar sessão");
  return data;
}

export async function excluirSessao(id) {
  const { error } = await supabase.from("sessoes").delete().eq("id_sessao", id);

  tratarErro(error, "Erro ao excluir sessão");
  return true;
}

/* =========================
   CONSULTAS
========================= */
export async function consultarSessoesSemIngressosRegistrados() {
  const { data: ingressos, error: erroIngressos } = await supabase
    .from("ingressos")
    .select("id_sessao");

  tratarErro(erroIngressos, "Erro ao buscar ingressos para a consulta");

  const idsSessoesComIngressos = [
    ...new Set(
      (ingressos ?? [])
        .map((item) => Number(item.id_sessao))
        .filter((id) => Number.isFinite(id)),
    ),
  ];

  let consulta = supabase
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
    .order("data_hora", { ascending: true });

  if (idsSessoesComIngressos.length > 0) {
    consulta = consulta.not(
      "id_sessao",
      "in",
      `(${idsSessoesComIngressos.join(",")})`,
    );
  }

  const { data, error } = await consulta;

  tratarErro(error, "Erro ao consultar sessões sem ingressos registrados");

  return (data ?? []).map((sessao) => ({
    id_sessao: sessao.id_sessao,
    filme: sessao.filmes?.titulo ?? "Filme não encontrado",
    genero: sessao.filmes?.genero ?? "",
    classificacao: sessao.filmes?.classificacao ?? "",
    data_hora: sessao.data_hora,
    sala: sessao.sala,
    preco: sessao.preco,
    ingressos_vendidos: sessao.ingressos_vendidos,
  }));
}
