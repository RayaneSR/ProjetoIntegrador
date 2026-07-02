
const express = require("express");
const cors = require("cors");

const db = require("./database/database");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando!");
});

//Fornecedores
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

app.post("/produtos", (req, res) => {

    const {
        nome_produto,
        codigo_barras,
        descricao,
        quantidade_estoque,
        categoria,
        data_validade,
        imagem
    } = req.body;

    if (!nome_produto) {
        return res.status(400).json({
            mensagem: "O nome do produto é obrigatório."
        });
    }

    if (!codigo_barras) {
        return res.status(400).json({
            mensagem: "O código de barras é obrigatório."
        });
    }

    if (!descricao) {
        return res.status(400).json({
            mensagem: "A descrição é obrigatória."
        });
    }

    if (quantidade_estoque == null) {
        return res.status(400).json({
            mensagem: "A quantidade em estoque é obrigatória."
        });
    }

    if (!categoria) {
        return res.status(400).json({
            mensagem: "A categoria é obrigatória."
        });
    }

    const sqlVerifica = "SELECT * FROM produtos WHERE codigo_barras = ?";

    db.get(sqlVerifica, [codigo_barras], (err, produto) => {

        console.log("Produto encontrado:", produto);

        if (err) {
            return res.status(500).json({
                erro: err.message

            });
        }

        if (produto) {
            return res.status(400).json({
                mensagem: "Produto com esse código de barras já está cadastrado!"
            });
        }

        const sql = `
        INSERT INTO produtos
        (
            nome_produto,
            codigo_barras,
            descricao,
            quantidade_estoque,
            categoria,
            data_validade,
            imagem
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        db.run(
            sql,
            [
                nome_produto,
                codigo_barras,
                descricao,
                quantidade_estoque,
                categoria,
                data_validade,
                imagem
            ],
            function (err) {

                if (err) {

                    return res.status(400).json({
                        erro: err.message
                    });

                }

                res.status(201).json({
                    mensagem: "Produto cadastrado com sucesso!",
                    id: this.lastID
                });

            }
        );
    });


});

app.get("/produtos", (req, res) => {

    const sql = "SELECT * FROM produtos";

    db.all(sql, [], (err, produtos) => {
        if (err) {
            return res.status(500).json({
                erro: err.message
            });
        }

        res.status(200).json(produtos);
    });

});

app.post("/associacoes", (req, res) => {

    //1. Recebe os dados
    const {
        fornecedor_id,
        produto_id
    } = req.body;

    //2.valida os campos 
    if (!fornecedor_id) {
        return res.status(400).json({
            mensagem: "O fornecedor é obrigatório."
        });
    }

    if (!produto_id) {
        return res.status(400).json({
            mensagem: "O produto é obrigatório."
        });
    }

    //3. Prepara o SQL para verificar o fornecedor
    const sqlFornecedor = "SELECT * FROM fornecedores WHERE id = ?";

    db.get(sqlFornecedor, [fornecedor_id], (err, fornecedor) => {
        if (err) {
            return res.status(500).json({
                erro: err.message
            });
        }

        if (!fornecedor) {
            return res.status(404).json({
                mensagem: "Fornecedor não encontrado."
            });
        }
        //4.Verifica se o produto já existe
        const sqlProduto = "SELECT * FROM produtos WHERE id = ?";

        db.get(sqlProduto, [produto_id], (err, produto) => {
            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            if (!produto) {
                return res.status(404).json({
                    mensagem: "Produto não encontrado."
                });
            }

            const sqlVerifica = "SELECT * FROM fornecedor_produtos WHERE fornecedor_id = ? AND produto_id = ?";

            db.get(sqlVerifica, [fornecedor_id, produto_id], (err, associacao) => {
                if (err) {
                    return res.status(500).json({
                        erro: err.message
                    });
                }

                if (associacao) {
                    return res.status(400).json({
                        mensagem: "Essa associação já existe."
                    });
                }

                const sqlInsert = "INSERT INTO fornecedor_produtos (fornecedor_id, produto_id) VALUES (?, ?)";

                db.run(sqlInsert, [fornecedor_id, produto_id], function (err) {
                    if (err) {
                        return res.status(400).json({
                            erro: err.message
                        });
                    }

                    res.status(201).json({
                        mensagem: "Associação criada com sucesso!",
                        id: this.lastID
                    });
                });
            });
        });
    });
});


app.get("/associacoes", (req, res) => {

    const sql = `
        SELECT
            fp.id,
            f.nome_empresa,
            p.nome_produto
        FROM fornecedor_produtos fp
        JOIN fornecedores f
            ON fp.fornecedor_id = f.id
        JOIN produtos p
            ON fp.produto_id = p.id
    `;

    db.all(sql, [], (err, associacoes) => {

        if (err) {
            return res.status(500).json({
                erro: err.message
            });
        }

        res.status(200).json(associacoes);

    });

});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});