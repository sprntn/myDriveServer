const 
    express = require('express'),
    router = express.Router()

const multer = require("multer");
const dealWithFiles = multer({});

const fileService = require('../BL/fileService')
const authService = require('../middleware/authService')

router.post('/upload-file/:path', authService, dealWithFiles.single("newFile"), async (req, res) => {
    try {
        const updatedFolder = await fileService.uploadFile(req.email + "*root" + req.params.path, req.file)
        res.json(updatedFolder)
    } catch (err) {
        res.status(err.code || 400).send(err.message)
    }
    
})


router.get('/dir-list/:path', authService, async (req, res) => {
    try {
        const result = await fileService.getFolderContent(req.email + "*root*" + req.params.path) 
        res.json(result)   
    } catch (err) {
        
        res.status(400).send(err.message)
    }    
})

router.get('/dir-list/', authService, async (req, res) => {
    try {
        const result = await fileService.getFolderContent(req.email + "*root") 
        res.json(result)
    } catch (err) {
        res.status(err.code || 400).send(err.message)
    }
})

router.get('/get-file/:path', async (req, res) => {
    
    try {
        const file = await fileService.getFile(req.email + "*" + req.params.path)
        res.json({file})
    } catch (error) {
        res.send(error)
    }
})

router.delete('/delete-item/:path', authService, async (req, res) => {
    
    try {
        
        const result = await fileService.deleteItem(req.email + "*root" + req.params.path)
        
        if(result){
            res.json({message:`path ${req.params.path} removed successfully`})
            
        }else{
            throw new Error("some error hapened")
        }
    } catch (err) {
        
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
    
    try {
        
        const {path} = req.body; 
        
        const updatedFolder = await fileService.addFolder(req.email + "*root" + path)
        
        if(updatedFolder){
            res.json(updatedFolder)
        }
        else{
            res.json({"message":"some error"})
        }
        
    } catch (error) {
        
        res.send(error)
    }
})

module.exports = router