-- =====================================================
-- Subconsulta usando NOT IN
--
-- Objetivo:
-- Mostrar sessões que ainda não possuem ingressos registrados.
--
-- Conteúdos usados:
-- SELECT, INNER JOIN, WHERE, NOT IN e subconsulta.
-- =====================================================

select
    s.id_sessao,
    f.titulo as filme,
    f.genero,
    f.classificacao,
    s.data_hora,
    s.sala,
    s.preco,
    s.ingressos_vendidos
from public.sessoes s
inner join public.filmes f on f.id_filme = s.id_filme
where s.id_sessao not in (
    select i.id_sessao
    from public.ingressos i
)
order by s.data_hora;