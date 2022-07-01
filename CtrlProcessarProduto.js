const seo = require("./src/seo.json");
const data = require("./src/data.json");
const db = require("./src/" + data.database);

var servidor;
module.exports = {
  configurar: async(srv) => {
    // Guardando a referência para o servidor
    servidor = srv;
    
    // Apresenta o formulário caso o path seja / e requisição via get
    servidor.get("/produtos", module.exports.apresentarFormulario); // votação

    // Apresenta o resultado da votação caso o path seja / e a requisição seja post
    servidor.post("/produtos", module.exports.processarProduto); // votação
  },
  apresentarFormulario: async (request, reply) => {
    // Se a requisição NÃO veio com o parâmetro 'raw', vamos repassar o objeto SEO
    // (Search Engine Optimization) que coloca dados nas tags META do arquivo hbs
    let params = request.query.raw ? {} : { seo: seo };

    // Verificando se ocorreu a autenticação
    let conta = request.cookies.conta;
    console.log("--->" + JSON.stringify(request.cookies));
    if(conta == null || conta == undefined) {
      params.error = "* Usuário não autenticado!";
      reply.view("/src/pages/login.hbs", params);
      return;
    }
    
    ///### servidor.usuariosAtivos[conta] = { ultimaChamada : new Date()};
    console.log(servidor.usuariosAtivos);

    // Recuperando os votos do banco de dados.
    // Montamos uma lista com as produtos e com as marcas obtidos
    const produtos = await db.obterProdutos();
    if (produtos) {
      params.produtos = produtos;
      if (produtos.length < 1) 
        params.setup = data.msgSetup;
    }
    // Se não obteve as linguagens, repassar a mensagem de erro.
    else params.error = data.msgErro;

    // Se a requisição veio com o parâmetro 'raw', devolvo o JSON com o conteúdo dos votos.
    // Se não, solicito a renderização da página index.hbs
    request.query.raw
      ? reply.send(params)
      : reply.view("/src/pages/index.hbs", params);
  },

  processarProduto: async (request, reply) => {
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
    // Verificando se o usuário está na lista do servidor
    let usuario = servidor.usuariosAtivos[conta];
    if(usuario == null || usuario == undefined) {
      params.error = "Usuário com sessão ativa!";
      reply.view("/src/pages/login.hbs", params);
      return;
    }
    
    // Adicionando Marca e Produto indicada
    await db.processarProduto(request.body.nome);
    
    const ctrlVisualizarApuracao = require("./CtrlVisualizarApuracao.js");
    await ctrlVisualizarApuracao.apresentarResultados(request,reply);

  },

  //---------------------------------------------------------------------//
};