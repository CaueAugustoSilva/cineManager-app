````markdown
# Documento Técnico - CineManager

## 1. Contexto da Solução

O CineManager é uma aplicação web desenvolvida para gerenciar informações de um cinema. O sistema permite cadastrar, listar, editar e excluir filmes e sessões, além de realizar consultas administrativas usando dados relacionados de filmes, sessões, clientes e ingressos.

O objetivo da solução é demonstrar a integração entre uma aplicação web e um banco de dados relacional, utilizando os conteúdos estudados na disciplina de Banco de Dados.

## 2. Tecnologias Utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript
- Bootstrap 5

### Banco de Dados

- Supabase
- PostgreSQL

### Controle de Versão

- Git
- GitHub

## 3. Modelo Lógico da Base de Dados

A base de dados possui quatro tabelas principais:

- `filmes`
- `sessoes`
- `clientes`
- `ingressos`

## 4. Estrutura das Tabelas

### Tabela: filmes

| Campo         | Tipo         | Restrição             |
| ------------- | ------------ | --------------------- |
| id_filme      | integer      | Primary Key           |
| titulo        | varchar(150) | Not Null              |
| genero        | varchar(80)  | Not Null              |
| duracao       | integer      | Not Null, maior que 0 |
| classificacao | varchar(10)  | Not Null              |
| diretor       | varchar(120) | Not Null              |

### Tabela: sessoes

| Campo              | Tipo          | Restrição                         |
| ------------------ | ------------- | --------------------------------- |
| id_sessao          | integer       | Primary Key                       |
| id_filme           | integer       | Foreign Key para filmes(id_filme) |
| data_hora          | timestamp     | Not Null                          |
| sala               | integer       | Not Null, maior que 0             |
| preco              | numeric(10,2) | Not Null, maior ou igual a 0      |
| ingressos_vendidos | integer       | Not Null, maior ou igual a 0      |

### Tabela: clientes

| Campo           | Tipo         | Restrição        |
| --------------- | ------------ | ---------------- |
| id_cliente      | integer      | Primary Key      |
| nome            | varchar(150) | Not Null         |
| cpf             | varchar(14)  | Not Null, Unique |
| email           | varchar(150) | Not Null, Unique |
| telefone        | varchar(20)  | Opcional         |
| data_nascimento | date         | Opcional         |
| data_cadastro   | timestamp    | Not Null         |

### Tabela: ingressos

| Campo           | Tipo          | Restrição                             |
| --------------- | ------------- | ------------------------------------- |
| id_ingresso     | integer       | Primary Key                           |
| id_cliente      | integer       | Foreign Key para clientes(id_cliente) |
| id_sessao       | integer       | Foreign Key para sessoes(id_sessao)   |
| assento         | varchar(10)   | Not Null                              |
| forma_pagamento | varchar(30)   | Not Null                              |
| valor_pago      | numeric(10,2) | Not Null, maior ou igual a 0          |
| data_compra     | timestamp     | Not Null                              |

## 5. Relacionamentos

### filmes 1:N sessoes

Um filme pode ter várias sessões cadastradas.

- Chave estrangeira: `sessoes.id_filme`
- Referencia: `filmes.id_filme`
- Regra de atualização: `ON UPDATE CASCADE`
- Regra de exclusão: `ON DELETE RESTRICT`

A regra `RESTRICT` impede a exclusão de um filme que já possui sessões associadas.

### clientes 1:N ingressos

Um cliente pode comprar vários ingressos.

- Chave estrangeira: `ingressos.id_cliente`
- Referencia: `clientes.id_cliente`
- Regra de atualização: `ON UPDATE CASCADE`
- Regra de exclusão: `ON DELETE RESTRICT`

A regra `RESTRICT` impede a exclusão de um cliente que possui ingressos associados.

### sessoes 1:N ingressos

Uma sessão pode ter vários ingressos vendidos.

- Chave estrangeira: `ingressos.id_sessao`
- Referencia: `sessoes.id_sessao`
- Regra de atualização: `ON UPDATE CASCADE`
- Regra de exclusão: `ON DELETE RESTRICT`

A regra `RESTRICT` impede a exclusão de uma sessão que possui ingressos associados.

## 6. Regras de Integridade

O banco utiliza:

- `PRIMARY KEY`;
- `FOREIGN KEY`;
- `NOT NULL`;
- `UNIQUE`;
- `CHECK`;
- `ON DELETE RESTRICT`;
- `ON UPDATE CASCADE`.

Exemplos:

- O CPF do cliente é único.
- O e-mail do cliente é único.
- A duração do filme deve ser maior que zero.
- O preço da sessão não pode ser negativo.
- O mesmo assento não pode ser vendido duas vezes para a mesma sessão.

## 7. Funcionalidades CRUD

A aplicação implementa CRUD completo para duas tabelas:

- `filmes`
- `sessoes`

### CRUD de Filmes

Funcionalidades:

- Cadastrar filme
- Listar filmes
- Editar filme
- Excluir filme

### CRUD de Sessões

Funcionalidades:

- Cadastrar sessão
- Listar sessões
- Editar sessão
- Excluir sessão

## 8. Consultas Implementadas na Aplicação

### Consultas de uma tabela

- Buscar filme pelo título
- Filtrar filmes por gênero
- Filtrar filmes por classificação
- Sessões por intervalo de data
- Sessões por sala
- Sessões por preço máximo

### Consultas com mais de uma tabela

- Filmes mais vendidos
- Filmes com maior faturamento
- Sessões por filme
- Sessões por gênero do filme
- Sessões sem ingresso registrado
- Sessões com maior faturamento

## 9. Scripts SQL Entregues

A pasta `database/` contém os scripts solicitados.

| Arquivo                         | Finalidade                               |
| ------------------------------- | ---------------------------------------- |
| 01_create_schema.sql            | Criação das tabelas, chaves e restrições |
| 02_insert_dados.sql             | Inserção de dados de teste               |
| 03_delete_dados.sql             | Exclusão dos dados das tabelas           |
| 04_consulta_agregada_filtro.sql | Consulta agregada com filtros            |
| 05_subconsulta_any_all.sql      | Subconsulta com operador ALL             |
| 06_subconsulta_exists.sql       | Subconsulta com EXISTS                   |
| 07_subconsulta_not_in.sql       | Subconsulta com NOT IN                   |

## 10. Exemplos de Consultas dos Scripts

### Consulta agregada com filtro

O arquivo `04_consulta_agregada_filtro.sql` calcula o faturamento por filme em determinado período, usando:

- `INNER JOIN`
- `WHERE`
- `GROUP BY`
- `HAVING`
- `COUNT`
- `SUM`
- `ORDER BY`

### Subconsulta com ALL

O arquivo `05_subconsulta_any_all.sql` mostra filmes com duração maior que todos os filmes de Comédia.

### Subconsulta com EXISTS

O arquivo `06_subconsulta_exists.sql` mostra clientes que compraram ingresso para filmes de Ação.

### Subconsulta com NOT IN

O arquivo `07_subconsulta_not_in.sql` mostra sessões que ainda não possuem ingressos registrados.

## 11. Integração com Supabase

A integração com o banco é feita no arquivo:

```txt
js/supabaseClient.js
```
````
