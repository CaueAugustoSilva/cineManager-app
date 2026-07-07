-- =====================================================
-- CineManager - Apagar dados das tabelas

-- A ordem respeita as chaves estrangeiras:
-- primeiro apagamos as tabelas filhas e depois as tabelas pais.
-- =====================================================

delete from public.ingressos;
delete from public.sessoes;
delete from public.clientes;
delete from public.filmes;