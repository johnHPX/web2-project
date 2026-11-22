# Claquete API

API REST desenvolvida com Node.js e Express para gerenciamento de filmes, usuários e registro de requisições HTTP. A aplicação utiliza MongoDB como banco de dados e disponibiliza funcionalidades para consulta, cadastro, remoção, autenticação de usuários e exportação de dados em CSV e PDF.

## Tecnologias utilizadas

- **Node.js:** ambiente de execução JavaScript.
- **Express:** framework para construção da API REST.
- **MongoDB Atlas:** banco de dados NoSQL.
- **MongoDB Driver:** integração com o banco de dados utilizando o driver oficial.
- **Jest:** execução dos testes automatizados.
- **Supertest:** testes de integração das rotas.
- **Multer:** processamento de arquivos enviados por requisições `multipart/form-data`.
- **Cloudinary:** armazenamento das imagens de capa dos filmes.
- **Nodemailer:** envio de e-mails, incluindo os códigos de verificação 2FA.

## Organização da aplicação

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

- Node.js e npm instalados.
- Uma instância MongoDB disponível ou uma conta no MongoDB Atlas.
- Uma conta no Cloudinary para armazenamento das imagens.
- Uma conta de e-mail e as credenciais necessárias para o envio de mensagens pela aplicação.

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd <DIRETORIO_DO_PROJETO>
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do backend (no mesmo contexto em que a aplicação carrega suas variáveis de ambiente) e configure:

```env
MONGODB_URI=sua_string_de_conexao
MONGODB_DATABASE=nome_do_banco_de_desenvolvimento
MONGODB_TEST_DATABASE=nome_do_banco_de_test

EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_aplicativo

CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

Descrição das variáveis:

| Variável                | Descrição                                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`           | String de conexão com o MongoDB.                                                                                                                                |
| `MONGODB_DATABASE`      | Banco de dados utilizado pela aplicação.                                                                                                                        |
| `MONGODB_TEST_DATABASE` | Banco de dados separado para execução dos testes.                                                                                                               |
| `EMAIL_USER`            | Endereço de e-mail utilizado pela aplicação para enviar mensagens aos usuários.                                                                                 |
| `EMAIL_PASS`            | Senha de aplicativo ou credencial exigida pelo serviço de e-mail. Para contas Google, utilize uma senha de app quando aplicável, e não a senha normal da conta. |
| `CLOUDINARY_CLOUD_NAME` | Identificador da conta Cloudinary.                                                                                                                              |
| `CLOUDINARY_API_KEY`    | Chave de API da conta Cloudinary.                                                                                                                               |
| `CLOUDINARY_API_SECRET` | Segredo da API da conta Cloudinary.                                                                                                                             |

> **Segurança:** não compartilhe o arquivo `.env` nem publique suas credenciais no repositório. Verifique se `.env` está incluído no `.gitignore`. Para utilizar o envio de e-mails e o upload de imagens, as credenciais dos respectivos serviços precisam estar configuradas.

### Executar a aplicação

```bash
npm start
```

A inicialização da aplicação é realizada pelo arquivo `server.js`, responsável por estabelecer a conexão com o MongoDB e iniciar o servidor HTTP.

## Documentação das rotas

As rotas estão organizadas em três grupos principais: filmes (`movies`), usuários (`users`) e registros de requisições (`logs`).

### 1. Filmes — Movies

As rotas de filmes permitem consultar, cadastrar, remover e exportar registros armazenados no MongoDB.

| Método | Endpoint         | Descrição                                                             |
| ------ | ---------------- | --------------------------------------------------------------------- |
| GET    | `/movies`        | Retorna a lista de filmes cadastrados.                                |
| GET    | `/movies/:id`    | Retorna um filme específico a partir do seu identificador.            |
| POST   | `/movies`        | Cadastra um novo filme, com possibilidade de envio de imagem de capa. |
| DELETE | `/movies/:id`    | Remove um filme a partir do seu identificador.                        |
| GET    | `/movies/export` | Exporta os registros de filmes em formato CSV.                        |
| GET    | `/movies/pdf`    | Exporta os registros de filmes em formato PDF.                        |

#### GET `/movies`

Retorna a lista de filmes cadastrados na coleção `movies`.

**Resposta esperada:** HTTP `200 OK` — consulta realizada com sucesso.

#### GET `/movies/:id`

Busca um filme utilizando seu identificador do MongoDB.

**Possíveis respostas:**

- `200 OK`: filme encontrado.
- `400 Bad Request`: identificador inválido.
- `404 Not Found`: nenhum filme encontrado com o identificador informado.

#### POST `/movies`

Realiza o cadastro de um novo filme.

**Formato da requisição:** `multipart/form-data`, quando houver envio de imagem.

Os campos textuais do filme e o arquivo da capa são enviados na mesma requisição. O campo destinado ao arquivo deve se chamar `imagemCapa`, conforme a configuração da rota de upload.

| Campo        | Descrição                                                                              |
| ------------ | -------------------------------------------------------------------------------------- |
| `titulo`     | Título do filme.                                                                       |
| `ano`        | Ano de lançamento.                                                                     |
| `nota`       | Nota do filme.                                                                         |
| `sinopse`    | Sinopse do filme.                                                                      |
| `duracao`    | Duração do filme. Envie no formato esperado pela validação da API.                     |
| `generos`    | Gêneros do filme. Envie no formato esperado pela API.                                  |
| `diretor`    | Diretor do filme.                                                                      |
| `idioma`     | Idioma do filme.                                                                       |
| `imagemCapa` | Arquivo de imagem da capa (campo de arquivo; envio opcional conforme a implementação). |

A imagem de capa é processada pelo Multer e armazenada no Cloudinary. A URL retornada pelo serviço é associada ao registro do filme no MongoDB. Os formatos configurados para o upload são JPG, JPEG e PNG.

**Resposta esperada:** HTTP `201 Created` — filme cadastrado com sucesso.

> **Observação:** ao enviar `multipart/form-data` com `fetch`, não defina manualmente o cabeçalho `Content-Type`. O navegador configura esse cabeçalho e o `boundary` automaticamente. O nome do campo do arquivo deve corresponder a `imagemCapa`.

#### DELETE `/movies/:id`

Remove um filme utilizando seu identificador.

**Possíveis respostas:**

- `200 OK`: remoção realizada com sucesso.
- `400 Bad Request`: identificador inválido.
- `404 Not Found`: filme não encontrado.

#### GET `/movies/export`

Gera um arquivo CSV contendo os registros de filmes armazenados no banco de dados.

A resposta é enviada como arquivo para download, utilizando o tipo de conteúdo `text/csv`.

#### GET `/movies/pdf`

Gera um arquivo PDF contendo os registros de filmes armazenados no banco de dados.

A resposta é enviada como arquivo para download. O tipo de conteúdo MIME convencional para documentos PDF é `application/pdf`.

### 2. Usuários — Users

As rotas de usuários permitem realizar o cadastro de contas e a autenticação por meio de verificação em duas etapas (2FA).

O processo de autenticação é dividido em duas etapas: primeiro, são verificadas as credenciais do usuário; em seguida, um código de verificação é enviado por e-mail para concluir o login.

| Método | Endpoint            | Descrição                                                      |
| ------ | ------------------- | -------------------------------------------------------------- |
| POST   | `/users/register`   | Cadastra um novo usuário.                                      |
| POST   | `/users/login`      | Valida as credenciais e solicita um código de verificação 2FA. |
| POST   | `/users/verify-2fa` | Verifica o código 2FA e conclui a autenticação.                |

#### POST `/users/register`

Realiza o cadastro de um novo usuário.

**Corpo da requisição:**

```json
{
  "nome": "João",
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta esperada:** HTTP `201 Created` — usuário cadastrado com sucesso.

**Possíveis respostas:**

- `201 Created`: usuário cadastrado com sucesso.
- `409 Conflict`: e-mail já cadastrado.
- `400 Bad Request`: dados inválidos ou ausentes.

#### POST `/users/login`

Realiza a primeira etapa da autenticação, verificando o e-mail e a senha informados.

Caso as credenciais sejam válidas, a aplicação gera um código de verificação 2FA e o envia para o endereço de e-mail cadastrado.

**Corpo da requisição:**

```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta esperada:** HTTP `200 OK` — credenciais validadas e código de verificação enviado.

**Possíveis respostas:**

- `200 OK`: credenciais válidas e código 2FA enviado.
- `401 Unauthorized`: credenciais inválidas.
- `400 Bad Request`: dados inválidos ou ausentes.

#### POST `/users/verify-2fa`

Realiza a segunda etapa da autenticação, verificando o código 2FA enviado ao e-mail do usuário.

O código deve ser informado juntamente com o endereço de e-mail correspondente.

**Corpo da requisição:**

```json
{
  "email": "joao@email.com",
  "codigo": "123456"
}
```

**Resposta esperada:** HTTP `200 OK` — código validado e autenticação concluída.

**Possíveis respostas:**

- `200 OK`: código validado com sucesso.
- `400 Bad Request`: código inválido ou expirado.

### 3. Registros de requisições — Logs

A aplicação possui um middleware responsável por registrar informações sobre as requisições HTTP recebidas.

Os registros são armazenados na coleção `logs` e podem ser consultados ou exportados.

| Método | Endpoint       | Parâmetros de consulta | Descrição                                                    |
| ------ | -------------- | ---------------------- | ------------------------------------------------------------ |
| GET    | `/logs`        | `data`                 | Consulta os registros de requisições de uma data específica. |
| GET    | `/logs/export` | `quantidade`           | Exporta uma quantidade determinada de registros em CSV.      |

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

## Exportação de dados

A aplicação disponibiliza funcionalidades para exportação de dados em CSV e PDF.

A geração dos arquivos CSV é centralizada em uma função utilitária (`csvGenerator.js`), permitindo reutilizar a lógica de exportação em diferentes entidades, como filmes e registros de requisições.

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

Os testes de integração verificam o comportamento dos endpoints e suas interações com o banco de dados, incluindo as funcionalidades de filmes, usuários e registros de requisições.

Antes de executar os testes, configure a variável `MONGODB_TEST_DATABASE` para utilizar um banco separado do ambiente principal.

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
