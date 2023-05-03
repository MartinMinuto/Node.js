import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes'

const app = express()

app.use('/auth', usuarioRoutes)

app.set('view engine', 'pug')
app.set('views', './views')

const port = 3000;
app.listen(port, () => {
 console.log(`El servidor esta funcionando en el puerto ${port}`)
})