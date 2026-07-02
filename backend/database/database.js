const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/database.db", (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err.message);
    } else {
        console.log("Banco conectado com sucesso!");
    }
});

// Criação da tabela de fornecedores
db.run(`
    CREATE TABLE IF NOT EXISTS fornecedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_empresa TEXT NOT NULL,
        cnpj TEXT NOT NULL UNIQUE,
        endereco TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT NOT NULL,
        contato_principal TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error("Erro ao criar tabela:", err.message);
    } else {
        console.log("Tabela fornecedores pronta!");
    }
});

// Criação da tabela de produtos
db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_produto TEXT NOT NULL,
        codigo_barras TEXT NOT NULL UNIQUE,
        descricao TEXT NOT NULL,
        quantidade_estoque INTEGER NOT NULL,
        categoria TEXT NOT NULL,
        data_validade TEXT,
        imagem TEXT
    )
`, (err) => {
    if (err) {
        console.error("Erro ao criar tabela produtos:", err.message);
    } else {
        console.log("Tabela produtos pronta!");
    }
});

// Criação da tabela de associação entre fornecedores e produtos
db.run(`
    CREATE TABLE IF NOT EXISTS fornecedor_produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fornecedor_id INTEGER NOT NULL,
        produto_id INTEGER NOT NULL,
        FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
    )
`, (err) => {
    if (err) {
        console.error("Erro ao criar tabela associação:", err.message);
    } else {
        console.log("Tabela fornecedor_produtos pronta!");
    }
});

module.exports = db;