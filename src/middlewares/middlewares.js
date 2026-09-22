function isSemana(req, res, next){
    let dia = new Date().getDay()
    if(dia<=5){
        next()
    } else {
        res.send("Acesso permitido apenas Segunda a Sexta")
    }
    
}

function addLog(req, res, next){
    //fs.readFileSync('log.txt', 'utf8')
    //hora e rota
    //essa função provavelmente será um middleware do app.listen()
    let data = new Date()
    console.log(`${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()} ${req.method} ${req.originalUrl}`)

}

module.exports = {
    isSemana,
    addLog
}

