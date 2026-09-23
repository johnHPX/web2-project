const express = require('express')
const router = express.Router()
const fs = require('fs')

let filmes = fs.readFileSync("./repository/filmes.json", 'utf8')
filmes = JSON.parse(filmes)
//verificar rotas post put delete
//nas rotas ainda falta persistencia pois é tirado o objeto da variavel mas nao é escrito em filmes.json
router.get("/api/filmes", (req, res) => {
	res.json(filmes)
})
router.get("/api/filmes/:filme", (req, res) => {
    let filme = req.params.filme
    let lista = [];
    lista = filmes.filter(elem => elem.titulo.includes(filme))
    res.json(lista)
})
///adicionar novos filmes na lista
router.post("/api/filmes/", (req, res) => {
    filmes.push(req.body) //verificar
})

///atualizar filmes existentes na lista
router.put("/api/filmes", (req, res) => {
    let filme = req.body //verificar
    filmes = filmes.map(elem => {
        if (filme.titulo == elem.titulo){ //
            elem = filme
        }
    })
})
router.delete("/api/filmes", (req, res) => {
    let filme = req.params.filme.toLowerCase()
    filmes = filmes.filter((elem) => filme.titulo != elem.titulo) //
})

router.get("/", (req, res) => {
    res.send("Está funcionando");
});
/*
router.get("/filmes/:filme", (req, res) => {
    res.sendFile(`filme.html`, {root: __dirname})
    }
)
 */


module.exports = router;
