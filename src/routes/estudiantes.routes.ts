import { Router } from 'express'
import { consultarEstudiantes, crearEstudiante } from '../controllers/estudiantes.controller'

const router = Router()

router.get('/estudiantes', consultarEstudiantes);
router.post('/estudiante', crearEstudiante)

export default router