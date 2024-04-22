import db from "../models/index"
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10);

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

let handleUserLogin = (email, password) => {
    return new Promise(async(res, rej) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if(isExist) {
                let user = await db.User.findOne({
                    attributes: ['id','email','password','roleId','firstName','lastName'],
                    where:{ email:email },
                    raw: true
               })
                if(user) {
                   let check = await bcrypt.compareSync(password, user.password);
                   if(check) {
                    userData.errCode = 0;
                    userData.errMessage = 'đúng rồi'
                     delete user.password;
                    userData.user = user;
                    

                   } else {
                    userData.errCode = 3;
                    userData.errMessage = 'sai mật khẩu';

                   }
                }else {
                    userData.errCode = 2;
                userData.errMessage = 'not found'
                }
                
            } else {
                userData.errCode = 1;
                userData.errMessage = 'không có tồn tại'
                
            }
            res(userData)
        }catch (e){
            rej(e)
        }
    })

}

let checkUserEmail = (userEmail) => {
    return new Promise (async (res, rej) => {
        try {
            let user = await db.User.findOne({
                where:{ email:userEmail }
            })
            if(user) {
                res(true)
            }else {
                res(false)
            }
        } catch(e) {
            rej(e)
        }
    })
}
let getAllUsers = (userId) => {
    return new Promise (async (res, rej) => {
        try {
            let users = '';
            if(userId === 'ALL'){
                users =  await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } else if (userId){
                users = await db.User.findOne({
                    where: { id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            res(users)
        } catch (e) {
            rej(e);
        }
    })
}
let createNewUser = (data) => {
    return new Promise (async (res, rej) => {
        try {
            let check = await checkUserEmail(data.email);
            if(check){
                res({
                    errCode:1,
                    message:'đã tồn tại email'   
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword (data.password);
            await db.User.create({
                email: data.email,
    password: hashPasswordFromBcrypt,
    firstName: data.firstName,
    lastName: data.lastName,
    address : data.address,
    phonenumber:data.phonenumber,
    gender:data.gender,
    roleId:data.roleId,
    positionID:data.positionID,
    image: data.image
            }) 
            res({
                errCode:0,
                message:'okkkkkk'
            })
            }
            
        } catch(e) {
            rej(e);
        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (res, rej) => {
        let user = await db.User.findOne({
            where:{ id: userId }
        })
        if(user) {
            await db.User.destroy({
                where:{ id: userId }
            });
        res({
            errCode:0,
            message:'đã xóa thành công'
        })

            
        }
        res({
            errCode:2,
            errMessage:'ko tìm thấy'
        })
    })
}
let updateUserData = (data) => {
    return new Promise(async (res, rej) => {
        try{
            if(!data.id){
                res({
                    errCode:2,
                    message:'missing id update'
                });
            }
            let user = await db.User.findOne({
                where: { id : data.id},
                raw:false
            })
            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionID = data.positionID;
                user.gender = data.gender;
                user.phonenumber = data.phonenumber;
                if(data.image){
                    user.image = data.image;
                }
                
                await user.save();
                
                res({
                    errCode:0,
                    message:'update succ'
                });
            } else {
                res();
            }
        }catch(e) {
            rej(e);
        }
    })
}
let getAllCodeSevice = (typeUser) => {
    return new Promise (async (resolve,rej) => {
        try {
            if(!typeUser){
                resolve({
                    errCode:1,
                    errMessage:'missing'
                })
            }else {
                let res = {};
            let allcode = await db.Allcode.findAll({
                where: {
                    type: typeUser
                }
            });
            res.errCode = 0;
            res.data = allcode;
            resolve(res);
            }
            
        } catch (e) {
            rej(e);
        }
    })
}
module.exports = {
    handleUserLogin:handleUserLogin,
    checkUserEmail:checkUserEmail,
    getAllUsers:getAllUsers,
    createNewUser:createNewUser,
    deleteUser:deleteUser,
    updateUserData:updateUserData,
    getAllCodeSevice:getAllCodeSevice
}
