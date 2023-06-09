import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes  from './routes/apiRoutes.js'
import db from './config/db.js'

const app = express()

app.use(express.urlencoded({extended: true}))

app.use( cookieParser() )

app.use( csrf({cookie: true}))

try{
  await db.authenticate()
  db.sync()
  console.log('Conexion Correcta a la  base de datos')
} catch(error) {
   console.log(error)
}

app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)
app.use('/api', apiRoutes)

app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', './views')

const port = process.env.PORT || 3000;
app.listen(port, () => {
 console.log(`El servidor esta funcionando en el puerto ${port}`)
})