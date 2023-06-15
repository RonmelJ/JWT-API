import jwt from 'jsonwebtoken'
import config from '../config.js'

//middleware para validar token antes de entrar a la api
export const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(401).json({error: "Access denied"})

    try {
        const verify = jwt.verify(token, config.token_secret)
        req.user = verify
        next()
    } catch (error) {
        res.status(400).json({error: "Invalid token"})
    }
}