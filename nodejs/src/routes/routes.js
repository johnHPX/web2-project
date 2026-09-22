let express = require('express')
let router = express.Router()

let filmes = fs.readFileSync("./filmes.json", 'utf8')
filmes = JSON.parse(filmes)
//levar para repository

router.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname})

});

router.get("/api/filmes", (req, res) => {
	res.json(filmes)

})

router.get("/filmes/:filme", (req, res) => {
    res.sendFile(`filme.html`, {root: __dirname})
    }
)

router.get("/api/filmes/:filme", (req, res) => {
    let filme = req.params.filme 
    for (i of filmes){
        if(i.nome.includes(filme)){
            res.json(i);
        }
    }
})
///adicionar novos filmes na lista
app.post("/api/filmes/", (req, res) => {
    filmes.push(req.body)
})

///atualizar filmes existentes na lista
app.put("/api/filmes", (req, res) => {
    let filme = req.body
    filmes = filmes.map(elem => {
        if (filme.nome == elem.nome){
            elem = filme
        }

    })

})


app.delete("/api/filmes", (req, res) => {
    let filme = req.params.filme.toLowerCase()
    filmes = filmes.filter((elem) => filme.nome != elem.nome)

})


module.exports = router;
