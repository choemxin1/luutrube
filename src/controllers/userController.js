import userService from '../services/userService';
let handleLogin =  async(req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if(!email || !password)
    {
        return res.status(500).json({
            errCode:1,
            message:'missing'
        })
        
    }
    let userData = await userService.handleUserLogin(email,password);
    return res.status(200).json({
        errCode:userData.errCode,
        message:userData.errMessage,
        user : userData.user ? userData.user : {}
        
        
    })
}
let handleGetAllUsers =  async (req, res) => {
    let id = req.query.id;
    if( !id) {
        return res.status(200).json({
            errCode:1,
            errMessage:"missing",
            users:[]
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        users :users
    })
}
let handleCreateNewUser = async (req, res) => {
    let data = req.body;
    let message = await userService.createNewUser(data);
    console.log('message1-create',message);
    return res.status(200).json(message);
}
let handleEditUser = async(req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    console.log('message2-update',message);
    return res.status(200).json(message);
}
let handleDeleteUser = async (req, res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode:1,
            errMessage:'missing'
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}
let getAllCode = async(req, res) => {
    let type = req.query.type;
    
    try {
        let data = await userService.getAllCodeSevice(type);
        return res.status(200).json(data);
    } catch(e) {
        console.log('error all code',e)
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error sever'
        })
    }
}
module.exports = {
    handleLogin:handleLogin,
    handleGetAllUsers:handleGetAllUsers,
    handleCreateNewUser:handleCreateNewUser,
    handleEditUser:handleEditUser,
    handleDeleteUser:handleDeleteUser,
    getAllCode:getAllCode
}