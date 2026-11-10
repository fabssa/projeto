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

    it('Deve atualizar o status com uma transição válida (HTTP 200)', async () => {
    const criado = await request(app)
      .post('/pedidos')
      .send({ cliente: 'Carlos Silva', tipo: 'entrega', valor: 350, prioridade: 'normal' });

    const res = await request(app)
      .patch(`/pedidos/${criado.body.id}/status`)
      .send({ status: 'em_preparacao' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('em_preparacao');
  });

  it('Deve retornar HTTP 400 para transição de status inválida', async () => {
    const criado = await request(app)
      .post('/pedidos')
      .send({ cliente: 'Carlos Silva', tipo: 'entrega', valor: 350, prioridade: 'normal' });

    const res = await request(app)
      .patch(`/pedidos/${criado.body.id}/status`)
      .send({ status: 'entregue' });

    expect(res.statusCode).toEqual(400);
  });

  it('Deve retornar HTTP 400 (e não 500) quando a requisição não tem corpo', async () => {
    const res = await request(app).post('/pedidos');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('erro');
  });

});