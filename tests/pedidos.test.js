const request = require('supertest');
const app = require('../src/app');
const pedidoService = require('../src/services/pedidoService');

beforeEach(() => {
  pedidoService.limparDados();
});

describe('Testes da API de Pedidos', () => {
  it('Deve criar um pedido válido (HTTP 201)', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({
        cliente: 'Carlos Silva',
        tipo: 'entrega',
        valor: 350,
        prioridade: 'normal'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('recebido');
  });

  it('Deve retornar HTTP 400 ao tentar criar com valor inválido', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({
        cliente: 'Carlos Silva',
        tipo: 'entrega',
        valor: -10,
        prioridade: 'normal'
      });

    expect(res.statusCode).toEqual(400);
  });

  it('Deve retornar HTTP 404 para busca de ID inexistente', async () => {
    const res = await request(app).get('/pedidos/999');
    expect(res.statusCode).toEqual(404);
  });
});