import express from "express"
import { formularioLogin } from "../controllers/usuarioController";
import { formularioRegistro } from "../controllers/usuarioController";

const router = express.Router();

router.get('/login', formularioLogin)
router.get('/registro', formularioRegistro)

export default router