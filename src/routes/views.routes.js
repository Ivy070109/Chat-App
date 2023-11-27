import { Router } from 'express'

const router = Router()

const users = [
    { 
        firstName: 'Carlos',
        lastName: 'Perren',
        age: 48, 
        email: 'cperren@gmail.com',
        phone: '+541168782239',
        role: 'admin'
    },
    {
        firstName: 'Carolina',
        lastName: 'Ferrero',
        age: 42, 
        email: 'cferrero@gmail.com',
        phone: '+541168289239',
        role: 'user'
    },
    {
        firstName: 'Juan',
        lastName: 'Perez',
        age: 30, 
        email: 'jperez@gmail.com',
        phone: '+541189745231',
        role: 'user'
    }
]

router.get('/chat', (req, res) => {
    res.render('chat', {
        title: 'Coder Compras Chat'
    })
})

export default router