
function isSemana(req, res, next){
    let dia = new Date().getDay()
    if(dia<5){
        next()
    } else {
        return "Acesso permitido apenas Segunda a Sexta"
    }
    
}

function addLog(req, res, next){

}

isSemana()

