let express = require('express')
let router = express.Router()
let fs = require('fs')

let filmes = fs.readFileSync("./repository/filmes.json", 'utf8')
filmes = JSON.parse(filmes)

router.get("/api/filmes", (req, res) => {
	res.json(filmes)
})
router.get("/api/filmes/:filme", (req, res) => {
    let filme = req.params.filme 
    for (i of filmes){
        if(i.nome.includes(filme)){
            res.json(i);
        }
    }
})
///adicionar novos filmes na lista
router.post("/api/filmes/", (req, res) => {
    filmes.push(req.body)
})

///atualizar filmes existentes na lista
router.put("/api/filmes", (req, res) => {
    let filme = req.body
    filmes = filmes.map(elem => {
        if (filme.nome == elem.nome){
            elem = filme
        }
    })
})
router.delete("/api/filmes", (req, res) => {
    let filme = req.params.filme.toLowerCase()
    filmes = filmes.filter((elem) => filme.nome != elem.nome)
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
