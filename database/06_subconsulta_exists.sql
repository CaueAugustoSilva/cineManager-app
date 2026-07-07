-- =====================================================
-- Subconsulta usando EXISTS
--
-- Objetivo:
-- Mostrar clientes que já compraram ingresso para filmes do gênero Ação.
--
-- Conteúdos usados:
-- SELECT, WHERE, EXISTS, INNER JOIN.
-- =====================================================

select
    c.nome,
    c.cpf,
    c.email,
    c.telefone
from public.clientes c
where exists (
    select *
    from public.ingressos i
    inner join public.sessoes s on s.id_sessao = i.id_sessao
    inner join public.filmes f on f.id_filme = s.id_filme
    where i.id_cliente = c.id_cliente
      and f.genero = 'Ação'
)
order by c.nome;