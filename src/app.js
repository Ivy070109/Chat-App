import express from 'express'
import handlebars from 'express-handlebars'
import { __dirname } from './utils.js'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.routes.js'

const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log(`Servicio activo en el puerto ${PORT}`)
})

const chat_messages = []
//cambiamos el nombre del servidor porque originalmente el nombre es io
const io = new Server(httpServer, {
    //es una herramienta de seguridad, cuando hay solicitudes desde otros lugares
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    }
})

io.on('connection', socket => {
    socket.on('user_connected', data => {
        socket.broadcast.emit('user_connected', data)
    })

    socket.on('message', data => {
        chat_messages.push(data)
        io.emit('messageLogs', chat_messages)
    })
})

//habilitación de middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
app.set('io', io)

app.use('/', viewsRouter)

app.use('/static', express.static(`${__dirname}/public`))