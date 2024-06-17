const fs = require('fs');
//const path = require('path');
//const basePath = "root/public";
const basePath = "usersStorage/";

// Combine two path segments
    //const filePath = path.join('data', 'user.json'); // Output: 'data/user.json'

async function deleteItem(path){
    console.log(`file service delete folder ${path}`)
    // const splited = path.split("*")
    // const decodedPath = basePath + splited.join("/")
    // const parentPath = basePath + splited.slice(0, -1).join("/")
    const decodedPath = basePath + path.split("*").join("/")
    console.log("decoded path: ", decodedPath);
    return deleteFolderRec(`${decodedPath}`)


    // deleteFolderRec(`${decodedPath}`)
    // // const parentPath = decodedPath.split("/").slice(0, -1).join("/")
    // const parentPath = path.split("*").slice(0, -1).join("/")
    // console.log("parent path: ", parentPath);
    // // console.log("path1: ", decodedPath, "\npath2: ", parentPath);
    // updatedFolder = getFolderContent(parentPath)
    // return updatedFolder
}

async function deleteFolderRec(path){
    console.log("deleting item: ", path)

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
            throw err; // Re-throw other errors for handling in the calling code
          }
    }
    



    // try {
    //     for(let i = path.length - 1; i >= 0; i--){
    //         console.log(path[i]);
    //         if(path[i] == "."){//is file
    //             console.log("file found");
    //             console.log("deleting file: ", path)
    //             //fs.unlinkSync(path)
    //             return true;
    //         }
    //         if(path[i] == "/"){//is folder
    //             console.log("folder found");
    //             const content = fs.readFileSync(path);
    //             content.forEach(item => deleteFolderRec(item.path))
    //             console.log("deleting folder: ", path)
    //             //fs.rmdirSync(path)
    //             return true;
    //         }
    //     }
    //     const content = fs.readFileSync(path);//for an one word path case
    //     content.forEach(item => deleteFolderRec(item.path))
    //     console.log("deleting folder: ", path)
    //     //fs.rmdirSync(path)
    //     return true    
    // } catch (error) {
    //     throw error
    // }
    // //check if item is file or folder
    
}

async function addFolder(path){
    console.log("file service add folder, path: ", path)
    //const decodedPath = path.split("*").slice(0, -1).join("/")//without new folder name
    const splited = path.split("*")
    const decodedPath = splited.slice(0, -1).join("/")
    const folderName = splited[splited.length - 1]
    console.log(`folder name: ${folderName}`)
    console.log(basePath);
    console.log(decodedPath);
    //console.log("folder name:", folderName);
    //console.log("decoded path:", decodedPath)
    //console.log("full path:", `${basePath}/${decodedPath}`);
    console.log("95 - full path:", `${basePath}${decodedPath}`);
    //const folderPath = `${basePath}/${decodedPath}`
    //const destExist = fs.existsSync(`root/${decodedPath}`)
    //const destExist = fs.existsSync(decodedPath)
    //const destExist = fs.existsSync(`${basePath}/${decodedPath}`)

    const destExist = fs.existsSync(`${basePath}${decodedPath}`)
    console.log(`desExist: ${destExist}`);
    if(!destExist){
        console.log("destination not exist")
        throw new Error('Folder destination not exists');
        //return false
    }

    //const isExist = fs.existsSync(`root/${decodedPath}/${folderName}`)
    console.log("109 - file path: ", `${basePath}/${decodedPath}/${folderName}`);
    const isExist = fs.existsSync(`${basePath}/${decodedPath}/${folderName}`)
    console.log(`isExist: ${isExist}`);
    if(isExist){
        console.log("folder already exist")
        throw new Error("this folder already exist")
    }
    console.log(`116 - full path 2 : ${basePath}/${decodedPath}/${folderName}`)
    //fs.mkdirSync(`root/${decodedPath}/${folderName}`)
    fs.mkdirSync(`${basePath}/${decodedPath}/${folderName}`)
    //return true
    updatedFolder = getFolderContent(`${decodedPath}`)
    console.log("updated folder: ", updatedFolder);
    return updatedFolder //{files, folders}
}

async function uploadFile(path, file){
    console.log("path : ", path);
    console.log("files service - upload file")
    
    const decodedPath = path.split("*").join("/")
    console.log("full path 2: " , `${basePath}${decodedPath}`);

    const destExist = fs.existsSync(`${basePath}${decodedPath}`)
    if(!destExist){
        console.log("destination not exist")
        throw new Error('Folder destination not exists');
        //return false
    }
    //console.log("full path 3: ", `${basePath}${decodedPath}/${file.originalname}`)
    const isExist = fs.existsSync(`${basePath}${decodedPath}/${file.originalname}`)
    if(isExist){
        console.log("file name already exist")
        throw new Error("this file name already exist")
    }

    fs.writeFileSync(`${basePath}${decodedPath}/${file.originalname}`, file.buffer)

    updatedFolder = getFolderContent(`${decodedPath}`)
    console.log("updated folder: ", updatedFolder);
    return updatedFolder //{files, folders}
}

// async function getFile(path){
//     console.log("files service - get file")
//     const decodedPath = path.split("*").join("/")
//     const filePath = `${basePath}/${decodedPath}`
//     console.log(`file path : ${filePath}`);
//     const file = fs.readFileSync(filePath);
//     console.log(`file: ${file}`);

//     return file;
// }

async function getFolderContent(path){//path = folder name / folder path relative to base path
    console.log("files service - get folder content, path: ", path)
    try {
        const decodedPath = path.split("*").join("/")
        //const folderPath = path.join(basePath, path)
        const folderPath = `${basePath}/${decodedPath}`
        console.log(`folder path: ${folderPath}`)
        const folderEntries = fs.readdirSync(folderPath, { withFileTypes: true });
        console.log(folderEntries);
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
    
    // fs.readdir(folderPath, { withFileTypes: true })
    //     .then(directoryEntries => {
    //         directoryEntries.forEach(dirent => {
    //         if (dirent.isFile()) {
    //             console.log(`File: ${dirent.name}`);
    //         } else if (dirent.isDirectory()) {
    //             console.log(`Directory: ${dirent.name}`);
    //         }
    //         });
    //     })
    //     .catch(err => {
    //         console.error('Error reading directory:', err);
    //     });
    // console.log(`folder path: ${folderPath}`);
    // const folders = fs.readdir(folderPath, { withFileTypes: false })
    // console.log(folders)
    // const files = fs.readdir(folderPath, { withFileTypes: true })
    // console.log(files)

    // return {folders, files}
}

module.exports = { getFolderContent, addFolder , deleteItem, uploadFile }