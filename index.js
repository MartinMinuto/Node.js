import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express()

app.use('/auth', usuarioRoutes)

app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', './views')

const port = 3000;
app.listen(port, () => {
 console.log(`El servidor esta funcionando en el puerto ${port}`)
})