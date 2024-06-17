const fs = require('fs');

const basePath = "usersStorage/";

async function deleteItem(path){
    
    const decodedPath = basePath + path.split("*").join("/")
    
    return deleteFolderRec(`${decodedPath}`)
}

async function deleteFolderRec(path){
    
    try {
        const item = fs.lstatSync(path)
        if (item.isDirectory()){
            fs.rmdirSync(path, {recursive: true})
        }
        else{
            fs.unlinkSync(path)
        }
        return true
    } catch (err) {
        if (err.code === 'ENOENT') {
            throw new Error('Item not found');
          } else if (err.code === 'ENOTEMPTY' && err.path) {
            throw new Error(`Directory "${err.path}" is not empty`);
          } else {
            throw err; 
          }
    }
    
}

async function addFolder(path){
    
    const splited = path.split("*")
    const decodedPath = splited.slice(0, -1).join("/")
    const folderName = splited[splited.length - 1]
    
    const destExist = fs.existsSync(`${basePath}${decodedPath}`)
    
    if(!destExist){
        
        throw new Error('Folder destination not exists');
        
    }

    
    const isExist = fs.existsSync(`${basePath}/${decodedPath}/${folderName}`)
    
    if(isExist){
        
        throw new Error("this folder already exist")
    }
    
    fs.mkdirSync(`${basePath}/${decodedPath}/${folderName}`)
    
    updatedFolder = getFolderContent(`${decodedPath}`)
    
    return updatedFolder //{files, folders}
}

async function uploadFile(path, file){
    
    const decodedPath = path.split("*").join("/")
    

    const destExist = fs.existsSync(`${basePath}${decodedPath}`)
    if(!destExist){
        
        throw new Error('Folder destination not exists');
        
    }
    
    const isExist = fs.existsSync(`${basePath}${decodedPath}/${file.originalname}`)
    if(isExist){
        
        throw new Error("this file name already exist")
    }

    fs.writeFileSync(`${basePath}${decodedPath}/${file.originalname}`, file.buffer)

    updatedFolder = getFolderContent(`${decodedPath}`)
    
    return updatedFolder 
}

async function getFolderContent(path){//path = folder name / folder path relative to base path
    
    try {
        const decodedPath = path.split("*").join("/")
        
        const folderPath = `${basePath}/${decodedPath}`
        
        const folderEntries = fs.readdirSync(folderPath, { withFileTypes: true });
        
        const folders = []
        const files = []
        for(const item of folderEntries){
            if(item.isFile()){
                files.push(item.name)
            }
            else if(item.isDirectory()){
                folders.push(item.name)
            }
        }

        
        return {folders, files}
    } catch (error) {
        throw error
    }
}

module.exports = { getFolderContent, addFolder , deleteItem, uploadFile }