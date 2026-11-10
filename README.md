# API de Gerenciamento de Pedidos

API REST desenvolvida em Node.js e Express para gerenciamento de pedidos de uma pequena loja. Os dados são armazenados em memória (ao reiniciar o servidor, os pedidos são apagados).

## Tecnologias

- Node.js e Express
- Jest e Supertest (testes automatizados)
- Postman (testes manuais)
- Git e GitHub

## Como Instalar e Executar

1. Clone este repositório:
   ```bash
   git clone https://github.com/fabssa/projeto.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o servidor (roda em `http://localhost:3000`):
   ```bash
   npm start
   ```

4. Para rodar os testes automatizados:
   ```bash
   npm test
   ```

## Arquitetura e Padrão Utilizado

O projeto adota uma arquitetura em camadas composta por:

- **Routes (`src/routes/`)**: Mapeamento dos endpoints HTTP.
- **Controllers (`src/controllers/`)**: Tratamento de requisições, respostas HTTP e validação dos dados de entrada.
- **Services (`src/services/`)**: Regras de negócio (como as transições de status) e persistência de dados em memória.

Fluxo de uma requisição: `Routes → Controller → Service`.

## Valores Aceitos para Validação

- **Tipos permitidos**: `entrega`, `retirada`
- **Prioridades permitidas**: `baixa`, `normal`, `alta`
- **Status permitidos**: `recebido`, `em_preparacao`, `enviado`, `entregue`, `cancelado`

Regras de validação na criação de um pedido:

- `cliente`: obrigatório, texto não vazio (espaços nas extremidades são removidos).
- `valor`: precisa ser um número maior que zero.
- `tipo` e `prioridade`: precisam ser um dos valores acima.
- O `id` é gerado automaticamente e o status inicial é sempre `recebido`.
- Uma requisição sem corpo é tratada como dados inválidos (HTTP 400).

## Transições de Status

O status de um pedido só pode mudar conforme a tabela abaixo. A regra fica na camada Service.

| Status atual | Pode mudar para |
|---|---|
| `recebido` | `em_preparacao`, `cancelado` |
| `em_preparacao` | `enviado`, `cancelado` |
| `enviado` | `entregue` |
| `entregue` | *(estado final)* |
| `cancelado` | *(estado final)* |

Qualquer mudança fora da tabela (inclusive repetir o mesmo status) retorna HTTP 400.

No `PATCH /pedidos/:id/status`, as verificações acontecem nesta ordem: primeiro se o `status` enviado é válido (400), depois se o pedido existe (404) e, por fim, se a transição é permitida (400).

## Endpoints

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| POST | `/pedidos` | Cadastra um novo pedido | 201 Created / 400 Bad Request |
| GET | `/pedidos` | Lista todos os pedidos | 200 OK |
| GET | `/pedidos/:id` | Consulta pedido por ID | 200 OK / 404 Not Found |
| PATCH | `/pedidos/:id/status` | Atualiza o status do pedido | 200 OK / 400 Bad Request / 404 Not Found |

## Exemplos de Requisição e Resposta

### POST /pedidos

Requisição:

```json
{
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal"
}
```

Resposta `201 Created`:

```json
{
  "id": 1,
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal",
  "status": "recebido"
}
```

Resposta `400 Bad Request` (exemplo com `"valor": -10`):

```json
{ "erro": "O campo valor deve ser um número positivo maior que zero." }
```

### GET /pedidos

Resposta `200 OK`:

```json
[
  {
    "id": 1,
    "cliente": "Carlos Silva",
    "tipo": "entrega",
    "valor": 350,
    "prioridade": "normal",
    "status": "recebido"
  }
]
```

### GET /pedidos/:id

Resposta `404 Not Found` (exemplo com `GET /pedidos/999`):

```json
{ "erro": "Pedido não encontrado." }
```

### PATCH /pedidos/:id/status

Requisição:

```json
{ "status": "em_preparacao" }
```

Resposta `200 OK`:

```json
{
  "id": 1,
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal",
  "status": "em_preparacao"
}
```

Resposta `400 Bad Request` (transição não permitida, exemplo de `recebido` para `entregue`):

```json
{ "erro": "Transição inválida: não é possível mudar de \"recebido\" para \"entregue\"." }
```

Resposta `400 Bad Request` (status fora da lista permitida ou ausente):

```json
{ "erro": "Status inválido. Valores aceitos: recebido, em_preparacao, enviado, entregue, cancelado." }
```

Resposta `404 Not Found` (ID inexistente):

```json
{ "erro": "Pedido não encontrado." }
```

## Tratamento de Erros

Os erros da API são devolvidos em JSON no formato `{ "erro": "mensagem" }`.

- **400**: dados inválidos (cliente vazio, valor inválido, tipo, prioridade ou status não reconhecidos), transição de status não permitida ou requisição sem corpo.
- **404**: pedido com o ID informado não existe.
- **500**: erro inesperado no servidor, tratado separadamente das validações.

## Testes

- **Automatizados (Jest + Supertest)**: `npm test`. Os testes ficam em `tests/pedidos.test.js` e cobrem: criação válida (201), valor inválido (400), consulta de ID inexistente (404), atualização de status com transição válida (200), transição inválida (400) e requisição sem corpo (400). Antes de cada teste, os dados em memória são limpos.
- **Manuais (Postman)**: capturas na pasta [`evidencias/`](./evidencias):

| Arquivo | Cenário |
|---|---|
| `01-criacao.jpeg` | POST válido, resposta 201 |
| `02-validacao.jpeg` | POST com valor negativo, resposta 400 |
| `03-listagem.jpeg` | GET da lista de pedidos, resposta 200 |
| `04-consulta-inexistente.jpeg` | GET de ID inexistente, resposta 404 |
| `05-atualizacao.jpeg` | PATCH de status válido, resposta 200 |

## Uso de Inteligência Artificial

**Utilização:** Sim, a IA foi utilizada para auxílio no planejamento da arquitetura em camadas, na estruturação de testes automatizados com Jest e na revisão do código em relação ao enunciado do projeto.

**Exemplo prático:** Ao revisar o código com a IA, percebi que as requisições dos exemplos do enunciado (criação válida, valor inválido, ID inexistente e atualização de status) estavam funcionando e os primeiros testes passavam. Porém, dependendo da requisição enviada, o resultado não correspondia ao que o enunciado pede:

- **Transições de status:** o `PATCH /pedidos/:id/status` aceitava qualquer status válido, então um pedido `entregue` podia voltar para `recebido`. O enunciado exige que a aplicação valide e documente as transições.
- **Requisição sem corpo:** um POST ou PATCH sem JSON retornava HTTP 500 ("erro interno"), quando o correto era HTTP 400, já que é um erro de quem envia os dados. O enunciado diz que erros inesperados (500) não devem ser apresentados como validações do usuário.

Esses casos não apareciam nos prints, mas o professor pode aplicar entradas diferentes das apresentadas, então precisavam ser corrigidos. A IA me ajudou com esse processo.


