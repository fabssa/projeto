const app = require('./app');
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor a rodar com sucesso em http://localhost:${PORT}`);
});