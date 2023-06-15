import express from 'express'
import config from './config.js'
//Routes imports
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import {verifyToken} from './middlewares/validate-token.js'

const app = express()
const port = config.port

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routes middlewares
app.use('/api/user', authRoutes)

app.use('/api/admin', verifyToken, adminRoutes)

app.get('/api', (req, res) => {
    res.json({
        estado: true,
        msg: "Funciona :)"
    })
})

//invalid route
app.use('/api', (req, res, next) => {
    res.status(404).json({
        error: "There is nothing here."
    }) 
})

//Inicializacion de server
app.listen(port, () => {
    console.log(`Servicio iniciado en puerto ${port}`)
})