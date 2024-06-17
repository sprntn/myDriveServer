const jwt = require('jsonwebtoken')
//const userController = require('../DL/user.controller')
const secret = process.env.JWT_SECRET
const bcrypt = require('bcrypt');
const saltRounds = 10;
const users = require('../DATA/users')

async function login(user){
    console.log("secret:", secret);
    console.log("login service -login", user)
    if(!user){
        throw new Error("wrong email or password")
    }
    const { email, password } = user
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const dbUser = users[email]
    console.log("dbUser", dbUser)
    if(!dbUser){
        throw new Error("wrong email or password")
    }
    const match = bcrypt.compare(dbUser.password, hashedPassword);
    if(match){
        console.log("password match:", dbUser.password)
        return generateToken(email, dbUser.permission, dbUser._id)
    }
    console.log("password not match")
}

function generateToken(email, permission, _id){
    const token = jwt.sign({
        email, 
        permission, 
        _id 
    }, secret, {expiresIn: 172800})
    console.log("token", token)
    return token
}

module.exports = {login}