import sql from 'mssql'
import config from '../config.js'

const dbSettings = {
    user: config.dbUser, 
    password: config.dbPassword, 
    server: config.dbServer,
    database: config.dbDatabase,
    options: {
        encrypt: true,
        trustServerCertificate: true 
    }
}

export const getConnection = async() => {
    try {
        const pool = await sql.connect(dbSettings)
        return pool
        //const res = await pool.request().query('SELECT 1')
        //console.log(res)
    } catch (error) {
        console.log(error)
    }
}

export {sql}