const porta = 8080
const router = require('./routes/routes.js')
const middleware = require('./middlewares/middlewares.js')
const express = require('express')
const app = express()

app.use(middleware.addLog)
app.use(middleware.isSemana)
app.use('/', router)

app.listen(porta, (req,res) => {
    console.log("servidor funcionando na porta", porta)
})
