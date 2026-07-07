-- =====================================================
-- Consulta com mais de uma tabela, dados agregados e filtros
--
-- Objetivo:
-- Mostrar o faturamento por filme no mês de julho de 2026.
--
-- Conteúdos usados:
-- SELECT, INNER JOIN, WHERE, GROUP BY, HAVING, COUNT, SUM e ORDER BY.
-- =====================================================

select
    f.titulo as filme,
    f.genero,
    count(i.id_ingresso) as total_ingressos_vendidos,
    sum(i.valor_pago) as faturamento_total
from public.filmes f
inner join public.sessoes s on s.id_filme = f.id_filme
inner join public.ingressos i on i.id_sessao = s.id_sessao
where i.data_compra between '2026-07-01 00:00:00' and '2026-07-31 23:59:59'
group by f.titulo, f.genero
having sum(i.valor_pago) >= 50
order by faturamento_total desc;