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
let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name ||
                !data.imageBase64 ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'createSpecialty succed'
                })
            }


        } catch (e) {
            reject(e);
        }
    })
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
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
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                })

                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else { //find by location 
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty;
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
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById:getDetailSpecialtyById
}
