const 
    express = require('express'),
    router = express.Router()

const userService = require('../BL/userService')
const loginService = require('../BL/loginService')

router.get('/test', (req, res) => {
    res.send("test")
})

router.post('/register', async (req, res) => {
    
    try {
        const user = await userService.addUser(req.body)
        res.send(user)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.post('/', async (req, res) => {
    try {
        const {email, password} = req.body
        const user = {email, password};
        if(!email || !password){
            throw new Error("required field is missing")
        }
        const token = await loginService.login(user)
        if(token){
            
            res.json({ token });
        }
        else{
            res.status(401).send("connection failed")
        }
    } catch (error) {
        res.status(401).json({message: error.message})
    }
})

module.exports = router