module.exports = {
  configurar: async(hbs) => {
    hbs.registerHelper('nomes', function (produtos) {
      let tamanho = produtos.length;
      let resultado = [];
      for(let i = 0; i < tamanho; i++)
        resultado.push(produtos[i].nome);
      return resultado;
    });
  }
}