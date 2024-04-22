
import _ from "lodash";


import db from "../models/index"
import bcrypt from 'bcryptjs'
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
const salt = bcrypt.genSaltSync(10);
const nodemailer = require("nodemailer");
let getBodyHMILEmailRemedy = (dataSend) => {
  let result = ''
  if (dataSend.language === 'vi') {
    result = ` 
  <h3>xin chao ${dataSend.patientName}!</h3> 
  <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Bệnh viện Ps </p>
  <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p> 
  <div> xin thành thành cảm ơn!</div>`
  }
  if (dataSend.language === 'en') {
    result =
      `
    <h3>Dear ${dataSend.patientName}!</h3> 
    <p>you received this email because you booked an online medical appointment on the hosipal PS </p>
    <p>bla blag</p> 
    <div> Sincerely thank!</div> 
    `
  }
  return result;
}
let sendAttachment = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports 
        auth: {
          user: 'nhat.nguyen1235813@hcmut.edu.vn', // generated ethereal user 
          pass: 'mimnxulcnhpwbszk', // generated ethereal passwo 
        },
      });;
      // send mail with defined transport object 
      let info = await transporter.sendMail({
        from: '"Bệnh viện đa khoa" <nhat.nguyen1235813@hcmut.edu.vn>', // sender address 
        to: `${data.email}`, // list of receivers 
        subject: "Kết quả đặt lịch khám bệnh", // Subject line 

        html:getBodyHMILEmailRemedy(data),
  attachments:
          [
            {
              filename: `remedy-${data.patientId}-${new Date().getTime()}.png`,
              content: data.imgBase64.split("base64,")[1],
              encoding: 'base64'
            },
          ],
      });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  })
}


module.exports = {
  sendAttachment: sendAttachment
};
