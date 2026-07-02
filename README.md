# CineManager

Aplicação web simples para gerenciamento de cinema usando HTML, CSS, JavaScript, Bootstrap e Supabase.

## Módulos

- Filmes
- Sessões
- Clientes
- Ingressos
- Relatórios

## Como rodar localmente

Use um servidor local. Não abra o arquivo HTML direto pelo `file://`, porque a navbar é carregada com `fetch()`.

Opção simples:

1. Instale a extensão **Live Server** no VS Code.
2. Abra a pasta do projeto no VS Code.
3. Clique com o botão direito em `index.html`.
4. Clique em **Open with Live Server**.

Opção por terminal:

```bash
python -m http.server 5500
```

Depois acesse `http://localhost:5500` no navegador.

## Banco de dados

O arquivo `database/schema.sql` contém uma estrutura sugerida para o Supabase, com tabelas, chaves estrangeiras, índices, trigger para atualizar ingressos vendidos e políticas RLS didáticas.

## Atenção sobre segurança

A chave `anon` do Supabase pode aparecer no front-end em projetos didáticos. Nunca coloque a chave `service_role` em código público.

Para produção, use autenticação e políticas RLS restritivas.
