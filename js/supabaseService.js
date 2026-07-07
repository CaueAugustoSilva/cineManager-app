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
