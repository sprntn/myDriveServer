const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//const users = require('../DL/users')
const users = require('../DATA/users')
//const fileService = require('./fileService')
//console.log(users)

async function addUser(user){
    console.log("user service - add user");
    if(!user){
        throw new Error("not a valid user")
    }
    if(users[user.email]){
        throw new Error("this email already registered")
    }
    const {email, password,  fullName} = user
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    users[email] = { password: hashedPassword, fullName }
    fs.writeFileSync('./DATA/users.js', `const users = ${JSON.stringify(users, null, 2)}\nmodule.exports = users`, 'utf8')
    if(!users[user.email]){
        throw new Error("something went wrong")
    }
    const newUser = users[email]
    fs.mkdirSync(`usersStorage/${email}`)
    fs.mkdirSync(`usersStorage/${email}/root`)
    return newUser
}

module.exports = {addUser}