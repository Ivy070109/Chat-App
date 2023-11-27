const socket = io()
//instanciamos el cliente del socket
const message = document.getElementById('message')
//hace referencia al input de handlebars con el id, allí se escribirán los mensajes
const received_messages = document.getElementById('received_messages')
//hace referencia a otro input en el handlebar, de nuevo mediante el id, per en éste caso en éste input se verán las transcripciones 

const users = [
    {
        id: 1,
        firstName: 'Carlos',
        lastName: 'Perren',
        userName: 'cperren'
    },
    {
        id: 2,
        firstName: 'Carolina',
        lastName: 'Ferrero',
        userName: 'cferrero'
    },
    {
        id: 3,
        firstName: 'Juan',
        lastName: 'Perez',
        userName: 'jperez'
    }
]

let user = ""
    //será vacio porque allí irá lo que escribamos

//esta es la "escucha" de los mensajes que enviemos
socket.on('messageLogs', data => {
    //equivale al aray chat_messages
    let messages = ''
    data.forEach(message => {
        messages += `${message.user.userName} dice ${message.message}<br />`
    //recorremos el array y actualiza el parrafo "received_messages", ya que con éste es que se emitió el evento messageLogs
    })
    received_messages.innerHTML = messages
    //ahora si podemos hacer que el elemento con id 'received_messages' tenga un innerHTML que se actualice y se modifique con los messages(array)
})

//ésta es la "escucha" de los usuarios que se conecten. Se le avisará mediante un mensaje a todos los usuarios conectados que hay una nueva conección
socket.on('user_connected', data => {
    Swal.fire({
        text: `${data.user.firstName} ${data.user.lastName} se ha conectado!`,
        toast: true, 
        position: 'top-right'
    })
})

//ésta función hará referencia a la función onclick presente en el handlebar, se accionará cada vez que apretemos el botón
const sendMessage = () => {
    if (message.value.trim() !== '') {
        socket.emit('message', { user: user, message: message.value.trim()})
        //le indicamos que al emitirse el evento, habrán dos valores que se enviarán. el user corresponderá al valor del user que pusimos al principio, mientras message corresponderá al valor que estemos poniendo 
        message.value = ''
        //ésto sirve para que una vez emitida la función con su mensaje, el input se limpie
    }
}

const authenticate = () => {    
    Swal.fire({
        title: 'Login',
        input: 'text',
        text: 'Ingresa el usuario para identificarte en el chat',
        inputValidator: value => {
            return !value && 'Por favor ingrese su usuario'
        },
        allowOutsideClick: false
    }).then(result => {
        //verificación del usuario(vemos si hay algún dato repetido)
        user = users.find(item => {
            return item.userName === result.value
        })
        if (user !== undefined) {
            //el servidor socket.io debe mandar el array de mensajes
            socket.emit('user_connected', { user: user })
            //ahora existe el evento en el que nos avisará cual es el nuevo usuario conectado
        } else {
            Swal.fire({
                text: "Usuario no válido",
                toast: true,
                position: "top-right",
            }).then((res) => {
                authenticate();
            })
        }
        console.log(user)
        // user = result.value
        // console.log(user)
    })
}

authenticate()

/** El evento de socket, que será el que reporte las cosas en cuanto hagamos enter
 * chatBox.addEventListener('keyup', evt => {
 *  if(evt.key === 'Enter'){
 *      if(chatBox.value.trim().length > 0){
 *          socket.emit('message', {user: user, message: chatBox.value})
 *          chactBox.value = ""
 *      }
 *  }    
 * })
 */

