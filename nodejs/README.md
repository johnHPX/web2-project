# web2-project
Um projeto para a disciplina de Sistemas Web 2. Consiste em desenvolver uma API com base nos requisitos pedidos pelo professor. Atividade feita em equipe. 


<br>
Server.js liga o servidor/api definindo a porta;
<br>
Server.js configurar Express e chamando as rotas em routes
<br>
routes fica as rotas
<br>
controller gerencia cada (requisicao resposta header etc)
<br>
services ficam as regras de negocios
<br>
repository consultas no banco de dados
<br>
middlewares ficam nossos middlewares


<h3>Requisitos</h3>
<ol>
    <li>Deve ter uma Rota GET para obter uma lista de items</li>
	<li>Deve ter uma rota POST para inserir um novo item</li>
	<li>Ter uma rota DELETE para excluir um item</li>
	<li>Ter uma rota GET para pesquisar um item pelo codigo</li>
	<li>Crie um middleware que permite o acesso da API apenas de segunda a sexta</li>
	<li>Ter um middleware que registra o horario e a rota de cada requisicao</li>
	<li>Rota GET que retorna registro de requisicao em uma determinada data informada</li>
	<li>Gerar PDF contendo uma lista de items</li>
	<li>Dados devem estar no codigo, numa array de items ou objeto</li>
	<li>Deve estar no Github</li>
	<li>Deve estar em nuvem no vercel ou outro servidor</li>
</ol>
