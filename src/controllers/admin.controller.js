import {getConnection, sql} from '../database/connection.js'
import {queriesAdmin} from '../database/queries.js'

const getAdmin = (req, res) => {
    res.json({
        error: null,
        data: {
            title: "Protected route",
            user: req.user
        }
    })
}

const getAllUsers = async (req, res) => {
    try {
        const pool = await getConnection()
        const getUsers = await pool.request().query(queriesAdmin.getAllUsers)

        res.json({
            error: null,
            info: {
                count: getUsers.rowsAffected[0]
            },
            results: getUsers.recordset
        })

    } catch (error) {
        res.status(400).json({error: "Get data error"})
    }
}

const getUserById = async(req, res) => {
    const {id} = req.params
    if (!id) return res.status(400).json({error: "You need an id!"})

    try {
        const pool = await getConnection()
        const getUser = await pool.request()
            .input('id', sql.Int, id)
            .query(queriesAdmin.getUserById)

        if (!getUser.recordset[0]) return res.status(400).json({error: "User not found!"}) 

        res.json(getUser.recordset[0])

    } catch (error) {
        res.status(400).json({error: "Hey! you must provide a valid id"})
    }
}

export default {
    getAdmin, 
    getAllUsers,
    getUserById
}