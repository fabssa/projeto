let pedidos = [];
let proximoId = 1;

const tiposValidos = ['entrega', 'retirada'];
const prioridadesValidas = ['baixa', 'normal', 'alta'];
const statusValidos = ['recebido', 'em_preparacao', 'enviado', 'entregue', 'cancelado'];
const transicoesPermitidas = {
  recebido: ['em_preparacao', 'cancelado'],
  em_preparacao: ['enviado', 'cancelado'],
  enviado: ['entregue'],
  entregue: [],
  cancelado: []
};

function transicaoPermitida(statusAtual, novoStatus) {
  return transicoesPermitidas[statusAtual].includes(novoStatus);
}

function criarPedido(dados) {
  const novoPedido = {
    id: proximoId++,
    cliente: dados.cliente.trim(),
    tipo: dados.tipo,
    valor: dados.valor,
    prioridade: dados.prioridade,
    status: 'recebido'
  };
  pedidos.push(novoPedido);
  return novoPedido;
}

function listarPedidos() {
  return pedidos;
}

function buscarPorId(id) {
  return pedidos.find(p => p.id === parseInt(id, 10));
}

function atualizarStatus(id, novoStatus) {
  const pedido = buscarPorId(id);
  if (!pedido) return null;
  pedido.status = novoStatus;
  return pedido;
}

function limparDados() {
  pedidos = [];
  proximoId = 1;
}

module.exports = {
  tiposValidos,
  prioridadesValidas,
  statusValidos,
  transicaoPermitida,
  criarPedido,
  listarPedidos,
  buscarPorId,
  atualizarStatus,
  limparDados
};