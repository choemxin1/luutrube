import db from "../models/index"
import bcrypt from 'bcryptjs'
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
const salt = bcrypt.genSaltSync(10);
const nodemailer = require("nodemailer");
let buildurlEmail = (doctorId, token) => {
    let result = `http://localhost:3000/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}
let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name ||
                !data.imageBase64 ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown ||
                !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter from sever clinic'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    address : data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'create clinic succed'
                })
            }


        } catch (e) {
            reject(e);
        }
    })
}
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinc.findAll({
            });
            if (data?.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }


            resolve({ errMessage: 'ok', errCode: 0, data })
        } catch (e) {
            reject(e);
        }

    })
}
let getDetailClincById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let data = await db.Clinc.findOne({
                    where: { id: inputId },
                })

                if (data) {
                    let doctorClinc = [];
                    
                        doctorClinc = await db.Doctor_Infor.findAll({
                            where: { ClincId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        })
                   
                    
                    data.doctorClinc = doctorClinc;
                } else data = {}
                resolve({
                    errMessage: 'ok', errCode: 0, data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClincById:getDetailClincById
}
