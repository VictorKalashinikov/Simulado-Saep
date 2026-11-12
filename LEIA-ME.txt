================================================================================
SISTEMA DE CONTROLE DE ESTOQUE - LOJA ESCOLA (PROJETO SAEP)
================================================================================

1. SOBRE O PROJETO
Aplicação web front-end desenvolvida em HTML5, CSS3 e JavaScript (ES6+) para
gerenciamento de estoque da Loja Escola, com persistência local via localStorage.

2. ESTRUTURA DE ARQUIVOS
estoque_escola/
├── index.html               -> Tela A: Painel inicial (KPIs e alertas)
├── produtos.html            -> Tela B: Catálogo, pesquisa e exclusão
├── cadastro.html            -> Tela C: Cadastro e edição de produtos
├── movimentacoes.html       -> Tela D: Registro de entradas/saídas e histórico
├── css/
│   └── estilo.css           -> Folha de estilos padronizada e responsiva
├── js/
│   └── app.js               -> Regras de negócio, validações e localStorage
├── docs/
│   ├── requisitos.txt       -> Etapa 1: Análise de requisitos e critérios
│   ├── modelo_dados.txt     -> Etapa 2: Diagrama DER/MER e justificativa
│   └── roteiro_testes.txt   -> Etapa 5: Casos de teste T01 a T05
└── LEIA-ME.txt              -> Instruções de execução

3. COMO EXECUTAR
1. Extraia a pasta "estoque_escola" em seu computador.
2. Não é necessário instalar servidor, Node.js, banco de dados ou internet.
3. Dê um duplo clique no arquivo "index.html" para abri-lo diretamente em
   qualquer navegador moderno (Google Chrome, Microsoft Edge, Firefox) OU abra a
   pasta no VS Code e clique em "Go Live" (extensão Live Server).
4. O sistema já inicia populado com os 4 produtos padrão da Loja Escola.
   Caso deseje restaurar os dados iniciais de fábrica a qualquer momento, basta
   limpar o localStorage no DevTools (F12 -> Application -> Local Storage) e
   recarregar a página.
