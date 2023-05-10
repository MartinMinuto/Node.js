import express from "express"
import { formularioLogin, formularioRegistro, formularioOlvidePassword, registrar, confirmar, resetPassword } from "../controllers/usuarioController.js";

const router = express.Router();

router.get('/login', formularioLogin)
router.get('/registro', formularioRegistro)
router.post('/registro', registrar)
router.get('/olvide-password', formularioOlvidePassword)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', formularioOlvidePassword)

export default router