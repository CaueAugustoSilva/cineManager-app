-- =====================================================
-- Subconsulta usando operador ALL
--
-- Objetivo:
-- Mostrar filmes com duração maior que todos os filmes do gênero Comédia.
--
-- Conteúdos usados:
-- SELECT, WHERE, subconsulta e ALL.
-- =====================================================

select
    f.titulo,
    f.genero,
    f.duracao,
    f.classificacao,
    f.diretor
from public.filmes f
where f.duracao > all (
    select f2.duracao
    from public.filmes f2
    where f2.genero = 'Comédia'
)
and f.genero <> 'Comédia'
order by f.duracao desc;