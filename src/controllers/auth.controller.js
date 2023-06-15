import {getConnection, sql} from '../database/connection.js'
import {queriesUser} from '../database/queries.js'
import Joi from '@hapi/joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config.js'

//Validaciones de registro de usuario
const schemaRegister = Joi.object({ 
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required()
})

//Creacion de usuario
export const postRegister = async(req, res) => {
    const {name, email, password} = req.body
    const {error} = schemaRegister.validate(req.body)

    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {

        const pool = await getConnection()

        const existEmail = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(queriesUser.validEmail)

        if (existEmail.recordset[0].exist) {
            return res.status(400).json({error: true, message: "Email already exists"})
        }

        //Cifrado de contraseña
        const jumps = await bcrypt.genSalt(10)
        const passwordCrypt = await bcrypt.hash(password, jumps)
 
        const respuestaSQL = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('pass', sql.Text, passwordCrypt)
            .query(queriesUser.insertUser)

        res.json({
            error: null,
            data: respuestaSQL.recordset[0]
        })

    } catch (error) {
        res.status(400).json(error)
    }
}

//Validaciones de login de usuario
const schemaLogin = Joi.object({ 
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required()
})

//Login de usuario
export const postLogin = async(req, res) => {
    const {error} = schemaLogin.validate(req.body)
    const {email, password} = req.body

    if (error) return res.status(400).json({error: error.details[0].message})
    
    try {
        const pool = await getConnection()

        const login = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(queriesUser.getUserLogin)

        if (!login.recordset[0]) {
            return res.status(400).json({
                error: true, 
                message: "Invalid login. Incorrect email or password."
            })
        }

         //Validacion de contraseña
         const validPass = await bcrypt.compare(password, login.recordset[0].password)
         if (!validPass) {
            return res.status(400).json({
                error: true, 
                message: "Invalid login. Incorrect email or password."
            })
        }

        //Creacion de token
        const token = jwt.sign({
            name: login.recordset[0].name,  //payload
            id: login.recordset[0].id
        }, config.token_secret) //Token secreto

        /*
        res.json({
            error: null,
            message: "Welcome!",
            token
        })
        */

        res.header('auth-token', token).json({
            error: null,
            data: {token}
        })

    } catch (error) {
        res.status(400).json(error)
    }

}