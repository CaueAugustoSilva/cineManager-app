-- =====================================================
-- CineManager - Inserção de dados de teste
--
-- Antes de executar este script novamente, execute primeiro:
-- database/03_delete_dados.sql
-- =====================================================

insert into public.filmes (titulo, genero, duracao, classificacao, diretor)
values
('Interestelar', 'Ficção Científica', 169, '10', 'Christopher Nolan'),
('Vingadores: Ultimato', 'Ação', 181, '12', 'Anthony Russo e Joe Russo'),
('Divertida Mente', 'Animação', 95, 'Livre', 'Pete Docter'),
('O Auto da Compadecida', 'Comédia', 104, '12', 'Guel Arraes'),
('A Origem', 'Ficção Científica', 148, '14', 'Christopher Nolan');

insert into public.sessoes (id_filme, data_hora, sala, preco, ingressos_vendidos)
values
(
    (select id_filme from public.filmes where titulo = 'Interestelar'),
    '2026-07-08 15:00:00',
    1,
    32.00,
    2
),
(
    (select id_filme from public.filmes where titulo = 'Vingadores: Ultimato'),
    '2026-07-08 18:30:00',
    2,
    38.00,
    2
),
(
    (select id_filme from public.filmes where titulo = 'Divertida Mente'),
    '2026-07-09 14:00:00',
    1,
    25.00,
    1
),
(
    (select id_filme from public.filmes where titulo = 'O Auto da Compadecida'),
    '2026-07-09 20:00:00',
    3,
    30.00,
    0
),
(
    (select id_filme from public.filmes where titulo = 'A Origem'),
    '2026-07-10 21:30:00',
    2,
    36.00,
    2
),
(
    (select id_filme from public.filmes where titulo = 'Interestelar'),
    '2026-07-11 19:00:00',
    4,
    34.00,
    0
);

insert into public.clientes (nome, cpf, email, telefone, data_nascimento, data_cadastro)
values
('Mariana Silva', '111.111.111-11', 'mariana@email.com', '(21) 99999-1111', '2001-03-15', '2026-07-01 10:00:00'),
('João Pereira', '222.222.222-22', 'joao@email.com', '(21) 99999-2222', '1998-09-22', '2026-07-01 11:00:00'),
('Camila Souza', '333.333.333-33', 'camila@email.com', '(21) 99999-3333', '2003-05-10', '2026-07-02 09:30:00'),
('Pedro Almeida', '444.444.444-44', 'pedro@email.com', '(21) 99999-4444', '1995-12-02', '2026-07-02 14:20:00'),
('Lucas Ferreira', '555.555.555-55', 'lucas@email.com', '(21) 99999-5555', '2000-07-18', '2026-07-03 16:45:00');

insert into public.ingressos (id_cliente, id_sessao, assento, forma_pagamento, valor_pago, data_compra)
values
(
    (select id_cliente from public.clientes where cpf = '111.111.111-11'),
    (
        select s.id_sessao
        from public.sessoes s
        inner join public.filmes f on f.id_filme = s.id_filme
        where f.titulo = 'Interestelar'
          and s.data_hora = '2026-07-08 15:00:00'
    ),
    'A1',
    'Pix',
    32.00,
    '2026-07-04 10:00:00'
),
(
    (select id_cliente from public.clientes where cpf = '222.222.222-22'),
    (
        select s.id_sessao
        from public.sessoes s
        inner join public.filmes f on f.id_filme = s.id_filme
        where f.titulo = 'Interestelar'
          and s.data_hora = '2026-07-08 15:00:00'
    ),
    'A2',
    'Cartão de crédito',
    32.00,
    '2026-07-04 10:05:00'
),
(
    (select id_cliente from public.clientes where cpf = '333.333.333-33'),
    (
        select s.id_sessao
        from public.sessoes s
        inner join public.filmes f on f.id_filme = s.id_filme
        where f.titulo = 'Vingadores: Ultimato'
          and s.data_hora = '2026-07-08 18:30:00'
    ),
    'B1',
    'Dinheiro',
    38.00,
    '2026-07-04 11:00:00'
),
(
    (select id_cliente from public.clientes where cpf = '444.444.444-44'),
    (
        select s.id_sessao
        from public.sessoes s
        inner join public.filmes f on f.id_filme = s.id_filme
        where f.titulo = 'Divertida Mente'
          and s.data_hora = '2026-07-09 14:00:00'
    ),
    'C1',
    'Cartão de débito',
    25.00,
    '2026-07-05 12:00:00'
),
(
    (select id_cliente from public.clientes where cpf = '555.555.555-55'),
    (
        select s.id_sessao
        from public.sessoes s
        inner join public.filmes f on f.id_filme = s.id_filme
        where f.titulo = 'A Origem'
          and s.data_hora = '2026-07-10 21:30:00'
    ),
    'D1',
    'Pix',
    36.00,
    '2026-07-05 13:00:00'
),
(
    (select id_cliente from public.clientes where cpf = '111.111.111-11'),
    (
        select s.id_sessao
        from public.sessoes s
        inner join public.filmes f on f.id_filme = s.id_filme
        where f.titulo = 'Vingadores: Ultimato'
          and s.data_hora = '2026-07-08 18:30:00'
    ),
    'B2',
    'Pix',
    38.00,
    '2026-07-06 09:00:00'
),
(
    (select id_cliente from public.clientes where cpf = '222.222.222-22'),
    (
        select s.id_sessao
        from public.sessoes s
        inner join public.filmes f on f.id_filme = s.id_filme
        where f.titulo = 'A Origem'
          and s.data_hora = '2026-07-10 21:30:00'
    ),
    'D2',
    'Cartão de crédito',
    36.00,
    '2026-07-06 09:30:00'
);