let porta = 8080
let router = require('./routes/routes.js')
let middlewares = require('./middlewares/middlewares.js')
let express = require('express')
let app = express()
app.use('/', router)

app.listen(porta, (req,res) => {
    console.log("servidor funcionando na porta", porta)
})
