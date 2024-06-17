const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const bcrypt = require('bcrypt');
const saltRounds = 10;
const users = require('../DATA/users')

async function login(user){
    
    if(!user){
        throw new Error("wrong email or password")
    }
    const { email, password } = user
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const dbUser = users[email]
    
    if(!dbUser){
        throw new Error("wrong email or password")
    }
    const match = bcrypt.compare(dbUser.password, hashedPassword);
    if(match){
        
        return generateToken(email, dbUser.permission, dbUser._id)
    }
}

function generateToken(email, permission, _id){
    const token = jwt.sign({
        email, 
        permission, 
        _id 
    }, secret, {expiresIn: 172800})
    
    return token
}

module.exports = {login}