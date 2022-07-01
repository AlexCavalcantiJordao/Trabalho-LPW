const seo = require("./src/seo.json");
const data = require("./src/data.json");
const db = require("./src/" + data.database);

const INICIAR_INCLUIR_PRODUTO = "/iniciarIncluirProduto";
const INCLUIR_PRODUTO = "/incluirProduto";
const OPERACAO = "Incluir";

var servidor;

module.exports = {
  configurar: async (srv) => {
    servidor = srv;

    // Apresenta o formulário caso o path seja / e requisição via get
    servidor.get(INICIAR_INCLUIR_PRODUTO, module.exports.apresentarFormulario);

    // Apresenta o resultado da votação caso o path seja / e a requisição seja post
    servidor.post(INCLUIR_PRODUTO, module.exports.incluir);
  },
  apresentarFormulario: async (request, reply) => {
    // Se a requisição NÃO veio com o parâmetro 'raw', vamos repassar o objeto SEO
    // (Search Engine Optimization) que coloca dados nas tags META do arquivo hbs
    let params = request.query.raw ? {} : { seo: seo };

    // Verificando se ocorreu a autenticação
    let conta = request.cookies.conta;
    if (conta == null || conta == undefined) {
      params.error = "Usuário não autenticado!";
      reply.view("/src/pages/login.hbs", params);
      return;
    }

    params.operacao = OPERACAO;
    params.funcao = INCLUIR_PRODUTO;

    // Se a requisição veio com o parâmetro 'raw', devolvo o JSON com o conteúdo dos Produtos e Marcas.
    // Se não, solicito a renderização da página form.hbs
    request.query.raw
      ? reply.send(params)
      : reply.view("/src/pages/form.hbs", params);
  },

  incluir: async (request, reply) => {
    // Se a requisição NÃO veio com o parâmetro 'raw', vamos repassar o objeto SEO
    // (Search Engine Optimization) que coloca dados nas tags META do arquivo hbs
    let params = request.query.raw ? {} : { seo: seo };

    // Flag para indicar os produtos que estão no formulário...
    params.verResultados = true;
    let produtos;

    // O produto vai ser enviado para DAO (Banco de Dados) para processá-lo e obter resultados....
    if (request.body.nome) produtos = await db.incluirProduto(request.body.nome);

const ctrlManterProdutos = require("./CtrlManterProdutos.js");
    await ctrlManterProdutos.manterProdutos(request,reply);
  },

  //---------------------------------------------------------------------//
};