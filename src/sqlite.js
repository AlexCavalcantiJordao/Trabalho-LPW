/**
 * Módulo para manipular o banco de dados SQLite da votação
 */

// Para acesso ao FileSystem
const fs = require("fs");

// Inicialização do Banco de Dados
const dbFile = "./.data/produtos.db";
const dbExiste = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
let db;

// Solicitando a abertura do Banco de Dados
sqlite
  .open({ filename: dbFile, driver: sqlite3.Database })
  .then(async (dBase) => {
    db = dBase;
    try {
      if (!dbExiste) {
        // Se o banco de dados não existe, ele será criado. Criando a tabela Voto
        await db.run(
          "CREATE TABLE Marca(id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR[20])"
        );

      
        // Criando a tabela Voto
        await db.run(
          "CREATE TABLE Produto(id INTEGER PRIMARY KEY AUTOINCREMENT, nome STRING, preco STRING, idMarca INTEGER, FOREIGN KEY (idMarca) REFERENCES Marca(id))"
        );
      } else {
        // Se já temos um banco de dados, lista os votos processados
        console.log(await db.all("SELECT * from Produto"));
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });

module.exports = {
  // Funções disponibilizadas pela exportação
  //--- processar novo voto ---//
  processarProduto: async (produtoProduto) => {
    try {
      // verificando os produtos que é válido
      const resultado = await db.all(
        "SELECT * from Produto WHERE id = ?",
        produtoProduto
      );
      if (resultado.length > 0) {
        await db.run("INSERT INTO Produto (idProduto, idMarca) VALUES (?, ?)", [
          produtoProduto,
          new Date().toISOString(),
        ]);
        await db.run(
          "UPDATE Produto SET numProdutos = numProdutos + 1 WHERE id = ?",
          produtoProduto
        );
      }
      // Retorna o resultado atual da produtos
      return await db.all("SELECT * from Produto");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  //--- Retorna os últimos Produtos   ---//
  obterProdutos: async () => {
    try {
      return await db.all(
        "SELECT * FROM Produto"   
      );
    } catch (dbError) {
      console.error(dbError);
    }
  },

  obterMarcas: async () => {
    try {
      return await db.all(
        "SELECT * from Marca"   
      );
    } catch (dbError) {
      console.error(dbError);
    }
  },

  //--- Limpa e reset os Produtos ---//
  limparProdutos: async () => {
    try {
      await db.run("DELETE FROM Produto");

      return [];
    } catch (dbError) {
      console.error(dbError);
    }
  },

  incluirMarca: async (nome) => {
    try {
      await db.run("INSERT INTO Marca (nome) VALUES (?)", nome);
      return true;
    } catch (dbError) {
      console.error(dbError);
    }
  },

   //--- Incluir um novo produto ---//
  incluirProduto: async (nome,idMarca) => {
    try {
      await db.run("INSERT INTO Produto (nome,idMarca) VALUES (?,?)", nome, idMarca);
      return true;
    } catch (dbError) {
      console.error(dbError);
    }
  },

  
  //--- Excluir um novo produto ---//
  excluirProduto: async (nome) => {
    try {
      await db.run("DELETE FROM Produto WHERE nome = ?", nome); // Aqui tem que mexer...
      return true;
    } catch (dbError) {
      console.error(dbError);
    }
  },
};