import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

const app = express()

app.use(express.urlencoded({extended: true}))

try{
  await db.authenticate()
  db.sync()
  console.log('Conexion Correcta a la  base de datos')
} catch(error) {
   console.log(error)
}

app.use('/auth', usuarioRoutes)

app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', './views')

const port = 3000;
app.listen(port, () => {
 console.log(`El servidor esta funcionando en el puerto ${port}`)
})