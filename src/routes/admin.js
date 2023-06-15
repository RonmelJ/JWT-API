import {Router} from 'express'
import ctr from '../controllers/admin.controller.js'

const router = Router()

router.get('/', ctr.getAdmin)
router.get('/users', ctr.getAllUsers)
router.get('/users/:id', ctr.getUserById)

export default router