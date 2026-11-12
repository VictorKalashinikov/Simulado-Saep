/**
 * SISTEMA DE CONTROLE DE ESTOQUE - LOJA ESCOLA
 * Persistência local via localStorage e regras de negócio completas.
 */

const STORAGE_KEYS = {
  PRODUTOS: 'saep_loja_escola_produtos',
  MOVIMENTACOES: 'saep_loja_escola_movimentacoes',
  INITIALIZED: 'saep_loja_escola_init_v1'
};

// Dados iniciais obrigatórios para testes (Etapa 3)
const PRODUTOS_INICIAIS = [
  {
    id: 'prod-1',
    codigo: 'PAP-001',
    nome: 'Caderno universitário',
    categoria: 'Papelaria',
    preco: 19.90,
    estoqueAtual: 12,
    estoqueMinimo: 5
  },
  {
    id: 'prod-2',
    codigo: 'PAP-002',
    nome: 'Caneta azul',
    categoria: 'Papelaria',
    preco: 3.50,
    estoqueAtual: 3,
    estoqueMinimo: 5
  },
  {
    id: 'prod-3',
    codigo: 'UTI-003',
    nome: 'Garrafa térmica',
    categoria: 'Utilidades',
    preco: 39.90,
    estoqueAtual: 8,
    estoqueMinimo: 4
  },
  {
    id: 'prod-4',
    codigo: 'ALI-004',
    nome: 'Kit lanche',
    categoria: 'Alimentação',
    preco: 24.00,
    estoqueAtual: 22,
    estoqueMinimo: 6
  }
];

// Inicializa o localStorage na primeira execução
function inicializarDados() {
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(PRODUTOS_INICIAIS));
    localStorage.setItem(STORAGE_KEYS.MOVIMENTACOES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// Funções de acesso aos dados (Repositório Local)
function obterProdutos() {
  const dados = localStorage.getItem(STORAGE_KEYS.PRODUTOS);
  return dados ? JSON.parse(dados) : [];
}

function salvarProdutos(lista) {
  localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(lista));
}

function obterMovimentacoes() {
  const dados = localStorage.getItem(STORAGE_KEYS.MOVIMENTACOES);
  return dados ? JSON.parse(dados) : [];
}

function salvarMovimentacoes(lista) {
  localStorage.setItem(STORAGE_KEYS.MOVIMENTACOES, JSON.stringify(lista));
}

// Utilitários de formatação
function formatarDoisDigitos(num) {
  return String(num).padStart(2, '0');
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarDataHora(isoString) {
  const data = new Date(isoString);
  const dia = formatarDoisDigitos(data.getDate());
  const mes = formatarDoisDigitos(data.getMonth() + 1);
  const hora = formatarDoisDigitos(data.getHours());
  const min = formatarDoisDigitos(data.getMinutes());
  return `${dia}/${mes} • ${hora}:${min}`;
}

function exibirAlerta(elementId, mensagem, tipo = 'error') {
  const box = document.getElementById(elementId);
  if (!box) return;
  box.textContent = mensagem;
  box.className = `alert-box ${tipo}`;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function limparAlerta(elementId) {
  const box = document.getElementById(elementId);
  if (!box) return;
  box.textContent = '';
  box.className = 'alert-box';
}

// ============================================================================
// TELA A: PAINEL INICIAL (index.html)
// ============================================================================
function renderizarPainel() {
  const produtos = obterProdutos();

  const totalProdutos = produtos.length;
  const totalUnidades = produtos.reduce((acc, p) => acc + Number(p.estoqueAtual), 0);
  const itensEstoqueBaixo = produtos.filter(p => Number(p.estoqueAtual) <= Number(p.estoqueMinimo));

  document.getElementById('kpi-total-produtos').textContent = formatarDoisDigitos(totalProdutos);
  document.getElementById('kpi-total-unidades').textContent = formatarDoisDigitos(totalUnidades);
  document.getElementById('kpi-estoque-baixo').textContent = formatarDoisDigitos(itensEstoqueBaixo.length);

  const tbody = document.getElementById('tabela-painel-body');
  if (!tbody) return;

  if (produtos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Nenhum produto cadastrado no sistema.</td></tr>';
    return;
  }

  // Ordena priorizando itens com estoque baixo no topo
  const ordenados = [...produtos].sort((a, b) => {
    const aBaixo = Number(a.estoqueAtual) <= Number(a.estoqueMinimo) ? 0 : 1;
    const bBaixo = Number(b.estoqueAtual) <= Number(b.estoqueMinimo) ? 0 : 1;
    return aBaixo - bBaixo;
  });

  tbody.innerHTML = ordenados.map(prod => {
    const isBaixo = Number(prod.estoqueAtual) <= Number(prod.estoqueMinimo);
    const badgeHtml = isBaixo
      ? '<span class="badge badge-warning">Estoque baixo</span>'
      : '<span class="badge badge-success">Normal</span>';

    return `
      <tr class="${isBaixo ? 'row-warning' : ''}">
        <td><strong>${prod.nome}</strong></td>
        <td>${prod.codigo}</td>
        <td><strong>${formatarDoisDigitos(prod.estoqueAtual)}</strong></td>
        <td>${badgeHtml}</td>
      </tr>
    `;
  }).join('');
}

// ============================================================================
// TELA B: CATÁLOGO DE PRODUTOS (produtos.html)
// ============================================================================
function renderizarCatalogo() {
  const termo = (document.getElementById('filtro-busca')?.value || '').trim().toLowerCase();
  const categoria = document.getElementById('filtro-categoria')?.value || '';

  const produtos = obterProdutos();
  const filtrados = produtos.filter(p => {
    const matchTermo = !termo ||
      p.nome.toLowerCase().includes(termo) ||
      p.codigo.toLowerCase().includes(termo);
    const matchCategoria = !categoria || p.categoria === categoria;
    return matchTermo && matchCategoria;
  });

  const contador = document.getElementById('contador-produtos');
  if (contador) {
    contador.textContent = `${filtrados.length} ${filtrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`;
  }

  const tbody = document.getElementById('tabela-produtos-body');
  if (!tbody) return;

  if (filtrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          Nenhum produto encontrado para a pesquisa informada.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtrados.map(prod => {
    const isBaixo = Number(prod.estoqueAtual) <= Number(prod.estoqueMinimo);
    return `
      <tr>
        <td><strong>${prod.codigo}</strong></td>
        <td>${prod.nome}</td>
        <td>${prod.categoria}</td>
        <td>${formatarMoeda(prod.preco)}</td>
        <td>
          <strong>${formatarDoisDigitos(prod.estoqueAtual)} un.</strong>
          ${isBaixo ? '<span class="badge badge-warning" style="margin-left:6px;">Baixo</span>' : ''}
        </td>
        <td>
          <div class="actions-cell">
            <a href="cadastro.html?id=${encodeURIComponent(prod.id)}" class="btn btn-secondary btn-sm">Editar</a>
            <button type="button" class="btn btn-danger-outline btn-sm" onclick="excluirProduto('${prod.id}')">Excluir</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function excluirProduto(produtoId) {
  limparAlerta('catalogo-alerta');
  const produtos = obterProdutos();
  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) return;

  // Regra de negócio: impedir exclusão se houver histórico de movimentações
  const movimentacoes = obterMovimentacoes();
  const possuiMovimentacoes = movimentacoes.some(m => m.produtoId === produtoId);

  if (possuiMovimentacoes) {
    exibirAlerta(
      'catalogo-alerta',
      `Não é possível excluir "${produto.nome}" (${produto.codigo}), pois este produto já possui histórico de movimentações registrado no sistema.`,
      'error'
    );
    return;
  }

  // Exigir confirmação explícita antes de excluir produto sem histórico
  const confirmado = window.confirm(
    `Tem certeza que deseja excluir o produto "${produto.nome}" (${produto.codigo})?
Esta ação não poderá ser desfeita.`
  );

  if (confirmado) {
    const atualizados = produtos.filter(p => p.id !== produtoId);
    salvarProdutos(atualizados);
    renderizarCatalogo();
    exibirAlerta('catalogo-alerta', `Produto "${produto.nome}" excluído com sucesso.`, 'success');
  }
}

// ============================================================================
// TELA C: CADASTRO E EDIÇÃO DE PRODUTO (cadastro.html)
// ============================================================================
function inicializarFormularioProduto() {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');

  const form = document.getElementById('form-produto');
  if (!form) return;

  if (editId) {
    const produtos = obterProdutos();
    const produto = produtos.find(p => p.id === editId);
    if (produto) {
      document.getElementById('titulo-pagina').textContent = 'Editar produto';
      document.getElementById('subtitulo-pagina').textContent = 'Atualize os dados do item mantendo seu histórico de movimentações';
      document.getElementById('produto-id').value = produto.id;
      document.getElementById('nome').value = produto.nome;
      document.getElementById('codigo').value = produto.codigo;
      document.getElementById('categoria').value = produto.categoria;
      document.getElementById('preco').value = produto.preco;
      document.getElementById('estoqueAtual').value = produto.estoqueAtual;
      document.getElementById('estoqueMinimo').value = produto.estoqueMinimo;
      document.getElementById('label-estoque-atual').innerHTML = 'Estoque atual <span class="req">*</span>';
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    limparAlerta('cadastro-alerta');

    const id = document.getElementById('produto-id').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const codigo = document.getElementById('codigo').value.trim().toUpperCase();
    const categoria = document.getElementById('categoria').value.trim();
    const precoStr = document.getElementById('preco').value.replace(',', '.');
    const estoqueAtualStr = document.getElementById('estoqueAtual').value.trim();
    const estoqueMinimoStr = document.getElementById('estoqueMinimo').value.trim();

    // Validação de campos obrigatórios
    if (!nome || !codigo || !categoria || precoStr === '' || estoqueAtualStr === '' || estoqueMinimoStr === '') {
      exibirAlerta('cadastro-alerta', 'Preencha todos os campos obrigatórios marcados com *.', 'error');
      return;
    }

    const preco = Number(precoStr);
    const estoqueAtual = Number(estoqueAtualStr);
    const estoqueMinimo = Number(estoqueMinimoStr);

    // Validação de preço > 0
    if (isNaN(preco) || preco <= 0) {
      exibirAlerta('cadastro-alerta', 'O preço unitário deve ser maior que zero (R$ > 0).', 'error');
      return;
    }

    // Validação de inteiros não negativos
    if (!Number.isInteger(estoqueAtual) || estoqueAtual < 0) {
      exibirAlerta('cadastro-alerta', 'O estoque atual/inicial deve ser um número inteiro não negativo (0 ou maior).', 'error');
      return;
    }

    if (!Number.isInteger(estoqueMinimo) || estoqueMinimo < 0) {
      exibirAlerta('cadastro-alerta', 'O estoque mínimo deve ser um número inteiro não negativo (0 ou maior).', 'error');
      return;
    }

    const produtos = obterProdutos();

    // Validação de SKU único
    const skuDuplicado = produtos.some(p => p.codigo.toUpperCase() === codigo && p.id !== id);
    if (skuDuplicado) {
      exibirAlerta('cadastro-alerta', `Já existe um produto cadastrado com o código/SKU "${codigo}". Utilize um código único.`, 'error');
      return;
    }

    if (id) {
      // Edição (preserva ID e histórico de movimentações)
      const index = produtos.findIndex(p => p.id === id);
      if (index !== -1) {
        produtos[index] = {
          ...produtos[index],
          nome,
          codigo,
          categoria,
          preco,
          estoqueAtual,
          estoqueMinimo
        };
        salvarProdutos(produtos);
        window.location.href = 'produtos.html';
      }
    } else {
      // Novo cadastro
      const novoProduto = {
        id: 'prod-' + Date.now(),
        nome,
        codigo,
        categoria,
        preco,
        estoqueAtual,
        estoqueMinimo
      };
      produtos.push(novoProduto);
      salvarProdutos(produtos);
      window.location.href = 'produtos.html';
    }
  });
}

// ============================================================================
// TELA D: MOVIMENTAÇÃO DE ESTOQUE (movimentacoes.html)
// ============================================================================
function inicializarMovimentacoes() {
  const selectProduto = document.getElementById('mov-produto');
  if (!selectProduto) return;

  const produtos = obterProdutos();
  selectProduto.innerHTML = '<option value="">Selecione um produto</option>' +
    produtos.map(p => `<option value="${p.id}">${p.nome} (${p.codigo})</option>`).join('');

  // Seleciona Caneta azul por padrão para espelhar visualmente o protótipo se existir
  const caneta = produtos.find(p => p.codigo === 'PAP-002') || produtos[0];
  if (caneta) {
    selectProduto.value = caneta.id;
  }

  atualizarPainelLateralMovimentacao();

  selectProduto.addEventListener('change', () => {
    limparAlerta('mov-alerta');
    atualizarPainelLateralMovimentacao();
  });

  // Estilo visual dos botões radio
  const radios = document.querySelectorAll('input[name="tipoMov"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
      radio.closest('.radio-option').classList.add('selected');
    });
  });

  const form = document.getElementById('form-movimentacao');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    limparAlerta('mov-alerta');

    const produtoId = selectProduto.value;
    const tipo = document.querySelector('input[name="tipoMov"]:checked')?.value;
    const qtdStr = document.getElementById('mov-quantidade').value.trim();
    const observacao = document.getElementById('mov-observacao').value.trim();

    if (!produtoId) {
      exibirAlerta('mov-alerta', 'Selecione um produto válido para movimentar.', 'error');
      return;
    }

    const quantidade = Number(qtdStr);
    if (!qtdStr || !Number.isInteger(quantidade) || quantidade <= 0) {
      exibirAlerta('mov-alerta', 'Informe uma quantidade inteira maior que zero.', 'error');
      return;
    }

    const listaProdutos = obterProdutos();
    const idx = listaProdutos.findIndex(p => p.id === produtoId);
    if (idx === -1) {
      exibirAlerta('mov-alerta', 'Produto não encontrado no cadastro.', 'error');
      return;
    }

    const produto = listaProdutos[idx];
    const saldoAnterior = Number(produto.estoqueAtual);

    // Regra de negócio: Saída não pode ultrapassar o saldo disponível
    if (tipo === 'Saída' && quantidade > saldoAnterior) {
      exibirAlerta(
        'mov-alerta',
        `Operação bloqueada: a saída (${quantidade} un.) ultrapassa o saldo disponível (${saldoAnterior} un.).`,
        'error'
      );
      return;
    }

    // Atualiza saldo
    const novoSaldo = tipo === 'Entrada'
      ? saldoAnterior + quantidade
      : saldoAnterior - quantidade;

    listaProdutos[idx].estoqueAtual = novoSaldo;
    salvarProdutos(listaProdutos);

    // Registra movimentação no histórico
    const movimentacoes = obterMovimentacoes();
    movimentacoes.unshift({
      id: 'mov-' + Date.now(),
      produtoId: produto.id,
      tipo,
      quantidade,
      dataHora: new Date().toISOString(),
      observacao
    });
    salvarMovimentacoes(movimentacoes);

    // Limpa inputs de quantidade/observação e atualiza interface
    document.getElementById('mov-quantidade').value = '';
    document.getElementById('mov-observacao').value = '';
    atualizarPainelLateralMovimentacao();
    exibirAlerta(
      'mov-alerta',
      `${tipo} de ${quantidade} un. registrada com sucesso para "${produto.nome}". Novo saldo: ${novoSaldo} un.`,
      'success'
    );
  });
}

function atualizarPainelLateralMovimentacao() {
  const produtoId = document.getElementById('mov-produto')?.value;
  const produtos = obterProdutos();
  const produto = produtos.find(p => p.id === produtoId);

  const nomeEl = document.getElementById('saldo-produto-nome');
  const numEl = document.getElementById('saldo-produto-valor');
  const badgeEl = document.getElementById('saldo-produto-badge');

  if (!produto) {
    nomeEl.textContent = 'Nenhum produto selecionado';
    numEl.textContent = '--';
    badgeEl.innerHTML = '';
  } else {
    nomeEl.textContent = produto.nome;
    numEl.textContent = formatarDoisDigitos(produto.estoqueAtual);
    const isBaixo = Number(produto.estoqueAtual) <= Number(produto.estoqueMinimo);
    badgeEl.innerHTML = isBaixo
      ? '<span class="badge badge-warning">Estoque baixo</span>'
      : '<span class="badge badge-success">Normal</span>';
  }

  // Renderiza histórico (filtrado pelo produto selecionado ou geral se nenhum selecionado)
  const todasMovs = obterMovimentacoes();
  const movsFiltradas = produto
    ? todasMovs.filter(m => m.produtoId === produto.id)
    : todasMovs;

  const listaEl = document.getElementById('lista-ultimas-movimentacoes');
  if (!listaEl) return;

  if (movsFiltradas.length === 0) {
    listaEl.innerHTML = '<li class="empty-state" style="padding: 16px 0;">Nenhuma movimentação registrada para este item.</li>';
    return;
  }

  listaEl.innerHTML = movsFiltradas.slice(0, 8).map(mov => {
    const isEntrada = mov.tipo === 'Entrada';
    const sinal = isEntrada ? '+' : '-';
    const obsTexto = mov.observacao ? ` • ${mov.observacao}` : '';
    return `
      <li class="history-item">
        <div class="history-info">
          <strong>${mov.tipo}</strong>
          <small>${formatarDataHora(mov.dataHora)}${obsTexto}</small>
        </div>
        <span class="history-qty ${isEntrada ? 'in' : 'out'}">
          ${sinal}${formatarDoisDigitos(mov.quantidade)}
        </span>
      </li>
    `;
  }).join('');
}

// ============================================================================
// BOOTSTRAP DA APLICAÇÃO
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  inicializarDados();

  const page = document.body.dataset.page;
  if (page === 'painel') {
    renderizarPainel();
  } else if (page === 'produtos') {
    renderizarCatalogo();
    document.getElementById('filtro-busca')?.addEventListener('input', renderizarCatalogo);
    document.getElementById('filtro-categoria')?.addEventListener('change', renderizarCatalogo);
    document.getElementById('btn-buscar')?.addEventListener('click', renderizarCatalogo);
  } else if (page === 'cadastro') {
    inicializarFormularioProduto();
  } else if (page === 'movimentacoes') {
    inicializarMovimentacoes();
  }
});
