import bcrypt from 'bcryptjs';
import db from '../models/index'
const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async(res,rej) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword (data.password);
            await db.User.create({
                email: data.email,
    password: hashPasswordFromBcrypt,
    firstName: data.firstName,
    lastName: data.lastName,
    address : data.address,
    phonenumber:data.phonenumber,
    gender:data.gender === "1" ? true : false,
    roleId:data.roleId,
    
            }) 
            res('okdddddddd')
        } catch (e){
            rej(e);
        }
    })
    
    // console.log('data from ser' + data)
    // console.log(hashPasswordFromBcrypt)
}
// let createNewUser = (data ) => {
//     console.log(data)
// }
let hashUserPassword = (password) => {
    return new Promise (async (res,rej) => {
        try {
            let hashPassword = await bcrypt.hashSync(password,salt);
            res(hashPassword);
        } catch(e){
            rej(e);
        }
    })
}
let getAllUser = () => {
    return new Promise (async(res, rej) => {
        try {
            let users = db.User.findAll({
                raw :true,
            });
            res(users)

        }catch(e){
            rej(e)
        }
    })
}
let getUserInfoById = (userId) => {
    return new Promise(async(res, rej) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId},
                raw:true,
            })
            if(user) {
                res(user)
            }else {
                res({})
            }
        } catch(e) {
            rej(e)
        }
    })
}
let updateUserData = (data) => {
    return new Promise ( async (res, rej) => {
        try {
            let user = await db.User.findOne({
                where: { id : data.id}
            })
            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                let allUsers = await db.User.findAll();
                res(allUsers);
            } else {
                res();
            }
        }catch(e) {
            rej(e)
        }
    })
    
}
let deleteUserById = (userId) => {
    return new Promise( async (res, rej) => {
        try {
            let user = await db.User.findOne({
                where:{id: userId}
            })
            if(user)
            {
                await user.destroy();
            } 
            res();
        } catch(e) {
            rej(e);
        }
    })
}
module.exports = {
    createNewUser:createNewUser,
    hashUserPassword:hashUserPassword,
    getAllUser:getAllUser,
    getUserInfoById:getUserInfoById,
    updateUserData:updateUserData,
    deleteUserById:deleteUserById
}