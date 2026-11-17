# Claquete API

API REST desenvolvida com Node.js e Express para gerenciamento de filmes e registro de requisições HTTP. A aplicação utiliza MongoDB como banco de dados e disponibiliza funcionalidades para consulta, cadastro, remoção e exportação de dados em formato CSV.

## Tecnologias utilizadas

- **Node.js:** ambiente de execução JavaScript.
- **Express:** framework para construção da API REST.
- **MongoDB Atlas:** banco de dados NoSQL.
- **MongoDB Driver:** integração com o banco de dados utilizando o driver oficial.
- **Jest:** execução dos testes automatizados.
- **Supertest:** testes de integração das rotas HTTP.

### Organização da aplicação

A aplicação utiliza uma arquitetura em camadas para separar as responsabilidades:

| Camada       | Responsabilidade                                                                |
| ------------ | ------------------------------------------------------------------------------- |
| Routes       | Define os endpoints e direciona as requisições.                                 |
| Controllers  | Recebe as requisições HTTP e retorna as respostas.                              |
| Services     | Implementa as regras de negócio.                                                |
| Repositories | Centraliza as operações de acesso ao banco de dados.                            |
| Middlewares  | Executa funcionalidades intermediárias durante o processamento das requisições. |
| Config       | Centraliza as configurações e a conexão com o MongoDB.                          |
| Utils        | Disponibiliza funções auxiliares reutilizáveis.                                 |

## Configuração e execução

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Conta no MongoDB Atlas ou uma instância MongoDB disponível.

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd <DIRETORIO_DO_PROJETO>
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
MONGODB_URI=sua_string_de_conexao
MONGODB_DATABASE=nome_do_banco_de_desenvolvimento
MONGODB_TEST_DATABASE=nome_do_banco_de_test
```

- `MONGODB_URI`: string de conexão com o MongoDB.
- `MONGODB_DATABASE`: banco de dados utilizado pela aplicação.
- `MONGODB_TEST_DATABASE`: banco de dados separado para execução dos testes.


### Executar a aplicação

```bash
npm start
```

A inicialização da aplicação é realizada pelo arquivo `server.js`, responsável por estabelecer a conexão com o MongoDB e iniciar o servidor HTTP.

## Documentação das rotas

As rotas estão organizadas em dois grupos principais: filmes (`movies`) e registros de requisições (`logs`).

### 1. Filmes — Movies

As rotas de filmes permitem consultar, cadastrar, remover e exportar registros armazenados no MongoDB.

| Método | Endpoint         | Descrição                                                  |
| ------ | ---------------- | ---------------------------------------------------------- |
| GET    | `/movies`        | Retorna a lista de filmes cadastrados.                     |
| GET    | `/movies/:id`    | Retorna um filme específico a partir do seu identificador. |
| POST   | `/movies`        | Cadastra um novo filme.                                    |
| DELETE | `/movies/:id`    | Remove um filme a partir do seu identificador.             |
| GET    | `/movies/export` | Exporta os registros de filmes em formato CSV.             |

#### GET `/movies`

Retorna a lista de filmes cadastrados na coleção `movies`.

**Resposta esperada:** HTTP 200 — lista de filmes.

#### GET `/movies/:id`

Busca um filme utilizando seu identificador do MongoDB.

**Possíveis respostas:**
- `200 OK`: filme encontrado.
- `400 Bad Request`: identificador inválido.
- `404 Not Found`: nenhum filme encontrado com o identificador informado.

#### POST `/movies`

Realiza o cadastro de um novo filme.

**Resposta esperada:** HTTP 201 — filme cadastrado com sucesso.

O corpo da requisição deve conter os dados necessários para o cadastro de um filme, conforme a estrutura definida pela aplicação.

#### DELETE `/movies/:id`

Remove um filme utilizando seu identificador.

**Possíveis respostas:**
- `200 OK`: remoção realizada com sucesso.
- `400 Bad Request`: identificador inválido.
- `404 Not Found`: filme não encontrado.

#### GET `/movies/export`

Gera um arquivo CSV contendo os registros de filmes armazenados no banco de dados.

A resposta é enviada como arquivo para download, utilizando o tipo de conteúdo `text/csv`.

### 2. Registros de requisições — Logs

A aplicação possui um middleware responsável por registrar informações sobre as requisições HTTP recebidas.

Os registros são armazenados na coleção `logs` e podem ser consultados ou exportados.

| Método | Endpoint       | Parâmetros   | Descrição                                                    |
| ------ | -------------- | ------------ | ------------------------------------------------------------ |
| GET    | `/logs`        | `data`       | Consulta os registros de requisições de uma data específica. |
| GET    | `/logs/export` | `quantidade` | Exporta uma quantidade determinada de registros em CSV.      |

#### GET `/logs`

Consulta os registros de requisições armazenados para uma data específica.

**Parâmetro de consulta:**

| Parâmetro | Tipo   | Descrição                                                          |
| --------- | ------ | ------------------------------------------------------------------ |
| `data`    | String | Data utilizada para filtrar os registros, no formato `YYYY-MM-DD`. |

**Exemplo:**

```http
GET /logs?data=2026-11-17
```

**Possíveis respostas:**
- `200 OK`: consulta realizada com sucesso.
- `400 Bad Request`: parâmetro de data ausente ou em formato inválido.

#### GET `/logs/export`

Exporta os registros de requisições em formato CSV.

**Parâmetro de consulta:**

| Parâmetro    | Tipo   | Descrição                                   |
| ------------ | ------ | ------------------------------------------- |
| `quantidade` | Number | Quantidade de registros a serem exportados. |

**Exemplo:**

```http
GET /logs/export?quantidade=10
```

**Possíveis respostas:**
- `200 OK`: arquivo CSV gerado com sucesso.
- `400 Bad Request`: quantidade ausente ou inválida.

## Exportação CSV

A aplicação possui uma funcionalidade de exportação de dados em formato CSV.

A geração dos arquivos é centralizada em uma função utilitária (`csvGenerator.js`), permitindo reutilizar a lógica de exportação em diferentes entidades, como filmes e registros de requisições.

Os arquivos são enviados diretamente na resposta HTTP para que o cliente possa realizar o download.

## Registro de requisições

O middleware `requisicoesLogger` registra informações das requisições processadas pela API.

Entre as informações registradas estão:

- Data da requisição.
- Horário.
- Método HTTP.
- Rota acessada.
- Código de status HTTP.
- Duração da requisição.

Os registros são armazenados no MongoDB e podem ser consultados posteriormente pela rota `/logs`.

## Testes automatizados

O projeto utiliza Jest e Supertest para realizar testes automatizados das rotas.

Os testes de integração verificam o comportamento dos endpoints e suas interações com o banco de dados.

Para executar os testes:

```bash
npm test
```

Para executar os testes sequencialmente:

```bash
npm test -- --runInBand
```

Os testes utilizam um banco de dados separado, evitando a manipulação dos dados utilizados pela aplicação principal.

## Considerações finais

O Claquete API foi estruturado com separação de responsabilidades, integração com banco de dados NoSQL e testes automatizados.

A organização em camadas facilita a manutenção e permite adicionar novas funcionalidades sem concentrar toda a lógica em um único componente.