# Sistema de Controle de Estoque — Loja Escola

**Projeto SAEP | Desenvolvimento de Sistemas**

Aplicação web desenvolvida para gerenciar o estoque da Loja Escola, permitindo o controle de produtos, cadastro, edição, movimentações e acompanhamento dos níveis de estoque.

O sistema foi desenvolvido utilizando HTML5, CSS3 e JavaScript (ES6+), com armazenamento de dados no `localStorage`, dispensando a necessidade de um banco de dados externo.

🔗 **Acesse o projeto:** [Simulado SAEP — Sistema de Estoque](https://victorkalashinikov.github.io/Simulado-Saep/)

---

## Funcionalidades

- **Dashboard:** painel inicial com indicadores (KPIs) e alertas relacionados ao estoque.
- **Gerenciamento de produtos:** visualização do catálogo, pesquisa e exclusão de produtos.
- **Cadastro e edição:** registro de novos produtos e atualização de informações existentes.
- **Controle de movimentações:** registro de entradas e saídas de mercadorias.
- **Histórico:** acompanhamento das movimentações realizadas no estoque.
- **Persistência de dados:** armazenamento local utilizando `localStorage`, mantendo os registros após atualizar ou fechar o navegador.
- **Dados iniciais:** sistema inicializado com quatro produtos padrão da Loja Escola.

## Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| HTML5 | Estruturação das páginas |
| CSS3 | Estilização e responsividade |
| JavaScript ES6+ | Lógica de negócio e interatividade |
| localStorage | Persistência local dos dados |

## Estrutura do projeto

```text
estoque_escola/
│
├── index.html
├── produtos.html
├── cadastro.html
├── movimentacoes.html
│
├── css/
│   └── estilo.css
│
├── js/
│   └── app.js
│
├── docs/
│   ├── requisitos.txt
│   ├── modelo_dados.txt
│   └── roteiro_testes.txt
│
└── LEIA-ME.txt
```

### Organização das páginas

- `index.html`: dashboard com indicadores e alertas.
- `produtos.html`: catálogo, pesquisa e exclusão de produtos.
- `cadastro.html`: cadastro e edição de produtos.
- `movimentacoes.html`: registro de entradas, saídas e histórico.

### Documentação

A pasta `docs/` contém os materiais de apoio e documentação técnica desenvolvidos durante o projeto:

- `requisitos.txt`: levantamento de requisitos e critérios do sistema.
- `modelo_dados.txt`: modelagem de dados (DER/MER) e justificativas.
- `roteiro_testes.txt`: documentação dos casos de teste T01 a T05.

## Como executar

O projeto não exige instalação de dependências, servidor ou banco de dados.

1. Clone o repositório ou faça o download dos arquivos.
2. Extraia a pasta do projeto, caso tenha baixado o ZIP.
3. Abra o arquivo `index.html` diretamente no navegador.
4. Alternativamente, abra a pasta no Visual Studio Code e utilize a extensão Live Server.

**Requisitos:** navegador moderno, como Google Chrome, Microsoft Edge ou Mozilla Firefox.

### Restaurar os dados iniciais

Os dados são armazenados no `localStorage` do navegador. Para restaurar os produtos padrão:

1. Abra as ferramentas de desenvolvedor (`F12`).
2. Acesse a aba **Application**.
3. Entre em **Local Storage**.
4. Limpe os dados armazenados pelo sistema.
5. Atualize a página.

O sistema será inicializado novamente com os quatro produtos padrão.

---

## Objetivos de aprendizagem

O desenvolvimento deste projeto envolve a aplicação prática de conceitos fundamentais de Desenvolvimento de Sistemas, incluindo:

- Manipulação do DOM com JavaScript.
- Organização de código e separação de responsabilidades.
- Implementação de operações CRUD.
- Validação e manipulação de dados.
- Persistência de informações no navegador.
- Modelagem de dados e levantamento de requisitos.
- Desenvolvimento de interfaces web responsivas.
- Documentação e elaboração de casos de teste.

---

**Projeto desenvolvido como atividade prática do curso Técnico em Desenvolvimento de Sistemas — SENAI/SESI, no contexto do SAEP.**
