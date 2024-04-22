import db from '../models/index'
import CRUDService from '../services/CRUDService'
let getHomePage = async(req, res) => {
    try {
        let data = await db.User.findAll();
        // console.log('.................')
        // console.log(data)
        // console.log('.................')
        return res.render('homepage.ejs', {
            data : JSON.stringify(data)
            // in ra dữ liệu người dùng trong database
        });
    } catch (e) {
console.log(e)
    }
    
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}
let postCRUD = async (req, res) => {
    let mess = await CRUDService.createNewUser(req.body);
    console.log(req.body);
    console.log(mess)
    return res.send('from sever');
}
let displayGetCRUD = async(req, res) => {
    let data = await CRUDService.getAllUser();
    console.log('--------------------')
   // console.log(data)
    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        console.log('data user')
        console.log('+++++++++++++')
        console.log(userData)
        console.log('++++++++')
        return res.render('editCRUD.ejs',{
            user: userData
        });
    }
    else {
        return res.send('fuck edit');
    }
}
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUser
    });
    
}
let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        await CRUDService.deleteUserById(userId);
    return res.send('delete edit');
    }
    else {
        
        return res.send('not fuond');
    }
}
// object: {
//     key: '',
//     value: ''
// }
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD:getCRUD,
    postCRUD:postCRUD,
    displayGetCRUD:displayGetCRUD,
    getEditCRUD:getEditCRUD,
    putCRUD:putCRUD,
    deleteCRUD:deleteCRUD
}
