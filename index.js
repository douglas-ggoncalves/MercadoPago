const express = require("express");
var mercadopago = require('mercadopago');
const app = express();

mercadopago.configure({
    sandbox: true, // isso significa que estamos em homologação
    access_token: 'TEST-7163746278663452-040908-d773402eefbc6ffc404447688a64d7d0-192618526'
});

app.get("/", (req, res) => {
    res.send("Olá mundo")
})

app.get("/pagar", async (req, res) => {
    var id = "" + Date.now();
    var email = "douglas@gmail.com";

    var dados = {
        items: [
            item = {
                id: id,// Poderíamos utilizar o UUID
                title: "5x Pilha;3x Camisas",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(199)
            }
        ],
        payer: {
            email: email
        },
        external_reference: id
    }

    try{
        var pagamento = await mercadopago.preferences.create(dados);
        console.log(pagamento);
        // salvar no banco neste momento
        return res.redirect(pagamento.body.init_point);
    }
    catch(err){
        console.log(err);
    }
})

app.listen(8080, (req, res) => {
    console.log("Servidor rodando")
})

