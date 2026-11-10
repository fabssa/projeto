# API de Gerenciamento de Pedidos

API REST desenvolvida em Node.js e Express para gerenciamento de pedidos de uma pequena loja.

## Arquitetura e Padrão Utilizado
O projeto adota uma arquitetura em camadas composta por:
- **Routes (`src/routes/`)**: Mapeamento dos endpoints HTTP.
- **Controllers (`src/controllers/`)**: Tratamento de requisições, respostas HTTP e validação dos dados de entrada.
- **Services (`src/services/`)**: Regras de negócio e persistência de dados em memória.

## Valores Aceitos para Validação
- **Tipos permitidos**: `entrega`, `retirada`
- **Prioridades permitidas**: `baixa`, `normal`, `alta`
- **Status permitidos**: `recebido`, `em_preparacao`, `enviado`, `entregue`, `cancelado`

## Como Instalar e Executar
1. Clone este repositório:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
Instale as dependências:Bashnpm install
Execute o servidor:Bashnpm start
Para rodar os testes automatizados:Bashnpm test
EndpointsMétodoRotaDescriçãoStatus SucessoPOST/pedidosCadastra um novo pedido201 CreatedGET/pedidosLista todos os pedidos200 OKGET/pedidos/:idConsulta pedido por ID200 OK / 404 Not FoundPATCH/pedidos/:id/statusAtualiza o status do pedido200 OK / 400 Bad Request / 404 Not FoundUso de Inteligência ArtificialUtilização: Sim, a IA foi utilizada para auxílio no planejamento da arquitetura em camadas e na estruturação de testes automatizados com Jest.Exemplo prático: A IA sugeriu agrupar a validação de rotas dentro da camada Service. A sugestão foi modificada, mantendo a validação de entrada HTTP na camada Controller para respeitar a separação de responsabilidades da arquitetura exigida.