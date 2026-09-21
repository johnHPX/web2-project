let express = require('express')
let router = express.Router()

let filmes = fs.readFileSync("./filmes.json", 'utf8')
filmes = JSON.parse(filmes)


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
router.post("/api/filmes/", (req, res) => {
    
})

///atualizar filmes existentes na lista
router.put("/api/filmes", (req, res) => {

})


router.delete("/api/filmes", (req, res) => {

})


module.exports = router;
