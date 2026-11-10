const pedidoService = require('../services/pedidoService');

function criar(req, res) {
  try {
    const { cliente, tipo, valor, prioridade } = req.body;

    if (!cliente || typeof cliente !== 'string' || cliente.trim() === '') {
      return res.status(400).json({ erro: 'O campo cliente é obrigatório e não pode ser vazio.' });
    }

    if (typeof valor !== 'number' || valor <= 0) {
      return res.status(400).json({ erro: 'O campo valor deve ser um número positivo maior que zero.' });
    }

    if (!tipo || !pedidoService.tiposValidos.includes(tipo)) {
      return res.status(400).json({ erro: `Tipo inválido. Valores aceitos: ${pedidoService.tiposValidos.join(', ')}.` });
    }

    if (!prioridade || !pedidoService.prioridadesValidas.includes(prioridade)) {
      return res.status(400).json({ erro: `Prioridade inválida. Valores aceitos: ${pedidoService.prioridadesValidas.join(', ')}.` });
    }

    const novoPedido = pedidoService.criarPedido({ cliente, tipo, valor, prioridade });
    return res.status(201).json(novoPedido);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno inesperado no servidor.' });
  }
}

function listar(req, res) {
  try {
    const lista = pedidoService.listarPedidos();
    return res.status(200).json(lista);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno inesperado no servidor.' });
  }
}

function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const pedido = pedidoService.buscarPorId(id);

    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno inesperado no servidor.' });
  }
}

function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !pedidoService.statusValidos.includes(status)) {
      return res.status(400).json({ erro: `Status inválido. Valores aceitos: ${pedidoService.statusValidos.join(', ')}.` });
    }

    const pedidoAtualizado = pedidoService.atualizarStatus(id, status);

    if (!pedidoAtualizado) {
      return res.status(404).json({ erro: 'Pedido não encontrado.' });
    }

    return res.status(200).json(pedidoAtualizado);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno inesperado no servidor.' });
  }
}

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizarStatus
};