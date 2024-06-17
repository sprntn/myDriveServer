const dotenv = require("dotenv")
dotenv.config()

const 
    express = require('express'),
    app = express(),
    PORT = 3000,
    cors = require('cors')



app.use(cors())
app.use(express.json())
app.use(express.static('usersStorage'));


const fileRouter = require('./router/file.router')
const userRouter = require('./router/user.router')
app.use('/file', fileRouter);
app.use('/user', userRouter);

//app.use(express.static("root/public"))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});