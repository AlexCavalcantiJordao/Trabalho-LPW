const seo = require("./src/seo.json");
const data = require("./src/data.json");
const db = require("./src/" + data.database);

var servidor;

module.exports = {
  configurar: async(srv) => {
    servidor = srv;
    // Apresenta os logs dos Produtos e Marcas caso o path seja /logs e a requisição seja get
    servidor.get("/manterprodutos", module.exports.manterProdutos);
  },
  
  manterProdutos: async (request, reply) => {
    // Se a requisição NÃO veio com o parâmetro 'raw', vamos repassar o objeto SEO
    // (Search Engine Optimization) que coloca dados nas tags META do arquivo hbs
    let params = request.query.raw ? {} : { seo: seo };

    // Verificando se ocorreu a autenticação
    let conta = request.cookies.conta;
    if(conta == null || conta == undefined) {
      params.error = "Usuário não autenticado!";
      reply.view("/src/pages/login.hbs", params);
      return;
    }
    
    // obtem a lista de Produtos...
    params.produtos = await db.obterProdutos();

    // Recuperando a mensagem de erro, caso tenha ocorrido algo....
    params.error = params.produtos ? null : data.msgErro;

    // Se a requisição veio com o parâmetro 'raw', devolvo o JSON com o conteúdo dos Produto
    // Se não, solicito a renderização da página admin.hbs
    request.query.raw
      ? reply.send(params)
      : reply.view("/src/pages/produtos.hbs", params);
  }
};
