const 
    express = require('express'),
    router = express.Router()

const multer = require("multer");
//const dealWithFiles = multer({dest: 'uploads/'});
const dealWithFiles = multer({});

const fileService = require('../BL/fileService')
const authService = require('../middleware/authService')

router.post('/upload-file/:path', authService, dealWithFiles.single("newFile"), async (req, res) => {
    console.log(`file.router - upload folder in path: ${req.params.path}`)
    console.log(req.file)//print "newFile" file
    //console.log(req.file.buffer)//print "newFile" file
    try {
        const updatedFolder = await fileService.uploadFile(req.email + "*root" + req.params.path, req.file)
        res.json(updatedFolder)
    } catch (err) {
        res.status(err.code || 400).send(err.message)
    }
    
})

router.get('/list', async (req, res) => {
    //test
    //res.json(["image1.png", "image2.png", "folder1", "folder2", "image3.png", "folder3", "folder4"])
})

router.get('/dir-list/:path', authService, async (req, res) => {
    console.log(`file.router - get folders list ${req.params.path}`)
    try {
        const result = await fileService.getFolderContent(req.email + "*root*" + req.params.path) 
        res.json(result)   
    } catch (err) {
        console.log('error:' ,err.message);
        res.status(400).send(err.message)
        //res.status(err.code || 400).json(err.message)
    }    
})

router.get('/dir-list/', authService, async (req, res) => {
    console.log(`file.router - get home folders list`)
    try {
        const result = await fileService.getFolderContent(req.email + "*root") 
        res.json(result)
    } catch (err) {
        res.status(err.code || 400).send(err.message)
    }
})

router.get('/get-file/:path', async (req, res) => {
    console.log(`file.router - get file ${req.params.path}`)
    try {
        const file = await fileService.getFile(req.email + "*" + req.params.path)
        res.json({file})
    } catch (error) {
        //res.status(error.code || 400).send(error.message)
        res.send(error)
    }
})

router.delete('/delete-item/:path', authService, async (req, res) => {
    console.log(`file.router - delete folder ${req.params.path}`) 
    try {
        //const result = await fileService.deleteItem(req.params.path)
        const result = await fileService.deleteItem(req.email + "*root" + req.params.path)
        //const updatedFolder = await fileService.deleteItem(req.email + "*root" + req.params.path)
        //res.json({message:`file.router - delete folder ${req.params.path}`})
        if(result){
            res.json({message:`path ${req.params.path} removed successfully`})
            //res.json(updatedFolder)
        }else{
            throw new Error("some error hapened")
        }
    } catch (err) {
        //res.send(error)
        console.error('Error removing item:', err);
        if (err.message === 'Item not found') {
            res.status(404).send('Item not found');
        } else if (err.message.startsWith('Directory ')) {
            res.status(400).send(err.message); // Specific error for non-empty directory
        } else {
            res.status(500).send('Internal server error');
        }
    }   
})

router.post('/add-folder', authService, async (req, res) => {
    console.log(`file.router - add folder`)
    console.log(req.body)
    try {
        // const { folderName } = req.body;
        // if (!folderName) {
        //     return res.status(400).send('Missing folder name in request body');
        // }
        //const { path, folderName } = req.body;
        const {path} = req.body; 
        //const result = await fileService.addFolder(req.email + "*root*" + path, folderName)
        //const updatedFolder = await fileService.addFolder(req.email + "*root*" + path, folderName)
        const updatedFolder = await fileService.addFolder(req.email + "*root" + path)
        console.log(updatedFolder)
        if(updatedFolder){
            res.json(updatedFolder)
        }
        else{
            res.json({"message":"some error"})
        }
        // const folderExists = await fs.exists(path);
        // if (folderExists) {
        //     return res.status(409).send('Folder already exists');
        // }
        // const name = await fileService.addFolder()
    } catch (error) {
        // res.status(error.code || 400).send(error.message)
        res.send(error)
    }
})

module.exports = router