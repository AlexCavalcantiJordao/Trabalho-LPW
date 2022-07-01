module.exports = {
  configurar: async(hbs) => {
    hbs.registerHelper('totais', function (produtos) {
      let tamanho = produtos.length;
      let resultado = [];
      for(let i = 0; i < tamanho; i++)
        resultado.push(produtos[i].numProdutos);
      return resultado;
    });  
  }
}