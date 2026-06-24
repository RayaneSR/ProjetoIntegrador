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

module.exports = db;