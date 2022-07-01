const seo = require("./src/seo.json");
const data = require("./src/data.json");
const db = require("./src/" + data.database);

var servidor;

module.exports = {
  configurar: async (srv) => {
    servidor = srv;
    // Apresenta o resultado da votação caso o path seja / e a requisição seja post
    servidor.get("/produtos", module.exports.apresentarResultados); <!-- resultados -->
  },
  apresentarResultados: async (request, reply) => {
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

    // Indicamos que queremos ver os resultados.
    params.verResultados = true;
    // Recuperando as Marcas e Produtos do banco de dados.
    // Montamos uma lista com as Marcas e número de Produtos obtidos
    const produtos = await db.obterProdutos();
    if (produtos) params.produtos = produtos;
    // Se não obteve as produtos, repassar a mensagem de erro.
    else params.error = data.msgErro;

    // Se a requisição veio com o parâmetro 'raw', devolvo o JSON com o conteúdo dos Produtos e Marcas.
    // Se não, solicito a renderização da página index.hbs
    reply.view("/src/pages/index.hbs", params);
  },
};
