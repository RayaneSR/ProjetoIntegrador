const express = require("express");

const db = require("./database/database");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando!");
});

app.post("/fornecedores", (req, res) => {
    const {
        nome_empresa,
        cnpj,
        endereco,
        telefone,
        email,
        contato_principal
    } = req.body;

    if (!nome_empresa) {
        return res.status(400).json({
            mensagem: "O nome da empresa é obrigatório."
        });
    }

    if (!cnpj) {
        return res.status(400).json({
            mensagem: "O CNPJ é obrigatório."
        });
    }

    if (!endereco) {
        return res.status(400).json({
            mensagem: "O endereço é obrigatório."
        });
    }

    if (!telefone) {
        return res.status(400).json({
            mensagem: "O telefone é obrigatório."
        });
    }

    if (!email) {
        return res.status(400).json({
            mensagem: "O e-mail é obrigatório."
        });
    }

    if (!contato_principal) {
        return res.status(400).json({
            mensagem: "O contato principal é obrigatório."
        });
    }


    const sqlVerifica = "SELECT * FROM fornecedores WHERE cnpj = ?";

    db.get(sqlVerifica, [cnpj], (err, fornecedor) => {

        console.log("Fornecedor encontrado:", fornecedor);

        if (err) {
            return res.status(500).json({
                erro: err.message

            });
        }

        if (fornecedor) {
            return res.status(400).json({
                mensagem: "Fornecedor com esse CNPJ já está cadastrado!"
            });
        }

        const sql = `
        INSERT INTO fornecedores
        (
            nome_empresa,
            cnpj,
            endereco,
            telefone,
            email,
            contato_principal
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

        db.run(
            sql,
            [
                nome_empresa,
                cnpj,
                endereco,
                telefone,
                email,
                contato_principal
            ],
            function (err) {

                if (err) {

                    return res.status(400).json({
                        erro: err.message
                    });

                }

                res.status(201).json({
                    mensagem: "Fornecedor cadastrado com sucesso!",
                    id: this.lastID
                });

            }
        );
    });

});

 app.get("/fornecedores", (req, res) => {

        const sql = "SELECT * FROM fornecedores";

        db.all(sql, [], (err, fornecedores) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.json(fornecedores);

        });

    });


app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});