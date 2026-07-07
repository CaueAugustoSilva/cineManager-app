# CineManager

Aplicação web para gerenciamento de cinema, desenvolvida como trabalho prático da disciplina Banco de Dados.

O sistema permite gerenciar filmes e sessões, além de realizar consultas administrativas usando informações de filmes, sessões, clientes e ingressos.

## Objetivo

Demonstrar a integração entre uma aplicação web e um banco de dados relacional, utilizando:

- criação de tabelas;
- chaves primárias;
- chaves estrangeiras;
- restrições de integridade;
- comandos DML;
- consultas simples;
- consultas com mais de uma tabela;
- funções de agregação;
- agrupamento;
- subconsultas.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Supabase
- PostgreSQL
- Git e GitHub

## Módulos visíveis da aplicação

- Início
- Filmes
- Sessões

As tabelas `clientes` e `ingressos` existem no banco de dados e são usadas nas consultas, mas não aparecem como abas principais da aplicação.

## Tabelas do banco

- `filmes`
- `sessoes`
- `clientes`
- `ingressos`

## Relacionamentos

- `sessoes.id_filme` referencia `filmes.id_filme`
- `ingressos.id_cliente` referencia `clientes.id_cliente`
- `ingressos.id_sessao` referencia `sessoes.id_sessao`

## Funcionalidades CRUD

O CRUD completo foi implementado para duas tabelas:

- Filmes
- Sessões

Operações disponíveis:

- Cadastrar
- Listar
- Editar
- Excluir

## Consultas implementadas na aplicação

### Consultas em Filmes

- Buscar filme pelo título
- Filtrar filmes por gênero
- Filtrar filmes por classificação
- Filmes mais vendidos
- Filmes com maior faturamento

### Consultas em Sessões

- Sessões por filme
- Sessões por intervalo de data
- Sessões por sala
- Sessões por preço máximo
- Sessões por gênero do filme
- Sessões sem ingresso registrado
- Sessões com maior faturamento

## Scripts SQL

Os scripts estão na pasta `database/`.

- `01_create_schema.sql`: cria as tabelas, chaves primárias, chaves estrangeiras e restrições.
- `02_insert_dados.sql`: insere dados de teste.
- `03_delete_dados.sql`: apaga os dados das tabelas usando `DELETE`.
- `04_consulta_agregada_filtro.sql`: consulta com mais de uma tabela, dados agregados e filtros.
- `05_subconsulta_any_all.sql`: subconsulta usando `ALL`.
- `06_subconsulta_exists.sql`: subconsulta usando `EXISTS`.
- `07_subconsulta_not_in.sql`: subconsulta usando `NOT IN`.

## Como configurar o banco no Supabase

1. Acesse o projeto no Supabase.
2. Abra o **SQL Editor**.
3. Execute o arquivo `database/01_create_schema.sql`.
4. Execute o arquivo `database/02_insert_dados.sql`.
5. Confira as tabelas no **Table Editor**.

Se quiser limpar os dados e inserir novamente:

1. Execute `database/03_delete_dados.sql`.
2. Execute novamente `database/02_insert_dados.sql`.

## Como rodar localmente

Use um servidor local. Não abra o arquivo HTML diretamente pelo `file://`, porque a navbar é carregada com `fetch()`.

### Opção 1: Live Server

1. Instale a extensão **Live Server** no VS Code.
2. Abra a pasta do projeto no VS Code.
3. Clique com o botão direito em `index.html`.
4. Clique em **Open with Live Server**.

### Opção 2: Terminal

Dentro da pasta do projeto, execute:

```bash
python -m http.server 5500
```
