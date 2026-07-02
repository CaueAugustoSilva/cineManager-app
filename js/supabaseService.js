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
    const { error } = await supabase
        .from("filmes")
        .delete()
        .eq("id_filme", id);

    tratarErro(error, "Erro ao excluir filme");
    return true;
}

/* =========================
   SESSÕES
========================= */
export async function obterSessoes() {
    const { data, error } = await supabase
        .from("sessoes")
        .select(`
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
        `)
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
    const { error } = await supabase
        .from("sessoes")
        .delete()
        .eq("id_sessao", id);

    tratarErro(error, "Erro ao excluir sessão");
    return true;
}

/* =========================
   CLIENTES
========================= */
export async function obterClientes() {
    const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id_cliente", { ascending: true });

    tratarErro(error, "Erro ao buscar clientes");
    return data ?? [];
}

export async function cadastrarCliente(cliente) {
    const { data, error } = await supabase
        .from("clientes")
        .insert([cliente])
        .select()
        .single();

    tratarErro(error, "Erro ao cadastrar cliente");
    return data;
}

export async function atualizarCliente(id, dados) {
    const { data, error } = await supabase
        .from("clientes")
        .update(dados)
        .eq("id_cliente", id)
        .select()
        .single();

    tratarErro(error, "Erro ao atualizar cliente");
    return data;
}

export async function excluirCliente(id) {
    const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id_cliente", id);

    tratarErro(error, "Erro ao excluir cliente");
    return true;
}

/* =========================
   INGRESSOS
========================= */
export async function obterIngressos() {
    const { data, error } = await supabase
        .from("ingressos")
        .select(`
            id_ingresso,
            id_cliente,
            id_sessao,
            assento,
            forma_pagamento,
            valor_pago,
            data_compra,
            clientes (
                id_cliente,
                nome
            ),
            sessoes (
                id_sessao,
                data_hora,
                sala,
                preco,
                filmes (
                    titulo
                )
            )
        `)
        .order("data_compra", { ascending: false });

    tratarErro(error, "Erro ao buscar ingressos");
    return data ?? [];
}

export async function cadastrarIngresso(ingresso) {
    const { data, error } = await supabase
        .from("ingressos")
        .insert([ingresso])
        .select()
        .single();

    tratarErro(error, "Erro ao cadastrar ingresso");
    return data;
}

export async function atualizarIngresso(id, dados) {
    const { data, error } = await supabase
        .from("ingressos")
        .update(dados)
        .eq("id_ingresso", id)
        .select()
        .single();

    tratarErro(error, "Erro ao atualizar ingresso");
    return data;
}

export async function excluirIngresso(id) {
    const { error } = await supabase
        .from("ingressos")
        .delete()
        .eq("id_ingresso", id);

    tratarErro(error, "Erro ao excluir ingresso");
    return true;
}
