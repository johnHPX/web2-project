const fs = require('fs')

function isSemana(req, res, next){
    let dia = new Date().getDay()
    if(dia<=5){
        next()
    } else {
        res.send("Acesso permitido apenas de Segunda a Sexta")
    }
    
}

async function addLog(req, res, next){

    let log = new Date().toISOString()
    fs.appendFile('./repository/logs.txt', log+"\n", erro => {
        if(erro){
            console.error("Ocorreu um erro:", erro)
        }
    })
    next()
}

module.exports = {
    isSemana,
    addLog
}

