const express = require('express');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();
app.use(express.json());

app.use('/pedidos', pedidoRoutes);

module.exports = app;