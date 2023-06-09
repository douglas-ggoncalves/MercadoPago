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
        // salvar no banco neste momento
        return res.redirect(pagamento.body.init_point);
    }
    catch(err){
        console.log(err);
    }
})

app.post("/not", (req, res) => {
    var id = req.query.id;

    setTimeout(() => {
        var filtro = {
            "order.id": id
        }

        mercadopago.payment.search({
            qs: filtro
        }).then(res => {
            var pagamento = res.body.results[0];

            if(pagamento != undefined){
                //console.log(pagamento); // Objeto
                console.log(pagamento.external_reference); // id definido anteriormente
                console.log(pagamento.status); // approved

                if(pagamento.status == "approved"){

                }
            }else{
                console.log("Pagamento não existe");
            }
        }).catch(err => {
            console.log(err);
        })
    }, 20000)

    res.send("OK")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
