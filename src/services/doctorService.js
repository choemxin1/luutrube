import { STRING } from "sequelize";
import db from "../models/index";
import _ from "lodash";
import emailService from "../services/emailService";

const MAX_NUMBER_SCHEDULE = 7;
import moment from 'moment';
let getTopDoctorHomeService = (limitInput) => {
  return new Promise(async (res, rej) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        where: { roleId: "R2" },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      res({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      rej(e);
    }
  });
};
let getAllDoctors = () => {
  return new Promise(async (res, rej) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      res({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      rej(e);
    }
  });
};

let DetailInforDoctor = (inputData) => {
  return new Promise(async (res, rej) => {
    try {

      if (
        !inputData.selectedDoctor.value ||
        !inputData.contentMarkdown ||
        !inputData.contentHTML ||
        !inputData.selectedPrice ||
        !inputData.selectedPayment ||
        !inputData.selectedProvince ||
        !inputData.nameClinic ||
        !inputData.addressClinic ||
        !inputData.note ||
        !inputData.specialtyId
        //!inputData.clinicId
      ) {
        res({
          errCode: 1,
          errMessage: "missing para doctor",
        });
      } else {
        let user = await db.Markdown.findOne({
          where: { doctorId: inputData?.selectedDoctor?.value },
          raw: false,
        });
        if (user) {
          user.contentHTML = inputData.contentHTML;
          user.contentMarkdown = inputData.contentMarkdown;
          user.des = inputData.des;
          user.upda;

          await user.save();

        } else {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            des: inputData.des,
            doctorId: inputData.selectedDoctor.value,
          });

        }
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: { doctorId: inputData?.selectedDoctor?.value },
          raw: false,
        });

        if (doctorInfor) {
          //update
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.provinceId = inputData.selectedProvince;
          doctorInfor.paymentId = inputData.selectedPayment;
          doctorInfor.nameClinic = inputData.nameClinic;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.clinicId = inputData.clinicId;
          await doctorInfor.save();

        } else {
          await db.Doctor_Infor.create({
            doctorId: inputData?.selectedDoctor?.value,
            priceId: inputData.selectedPrice,
            provinceId: inputData.selectedProvince,
            paymentId: inputData.selectedPayment,
            nameClinic: inputData.nameClinic,
            addressClinic: inputData.addressClinic,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
          });

        }
        res({
          errCode: 0,
          data: " infor doctor success",
        });





      }
    } catch (e) {
      rej(e);
    }
  });
};
let getDetailDoctorByIdService = (inputId) => {
  return new Promise(async (res, rej) => {
    try {
      if (!inputId) {
        res({
          errCode: 1,
          errMessage: "Missing para id doctor",
        });
      } else {

        let dataDoctor = await db.User.findOne({
          where: { id: inputId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            //{model: db.Allcode, as:'positionData',attributes:['valueEn','valueVi']},
            //{model: db.Allcode, as:'genderData',attributes:['valueEn','valueVi']}
            { model: db.Markdown },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],

            },
            //{ model: db.Doctor_Infor },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ['id', 'doctorId'],
                // include: [
                //   // {
                //   //   model: db.Allcode,

                //   //   where: { KeyMap: inputId },
                //   //    attributes: ["valueEn", "valueVi"]
                //   // },
                //   {
                //     model: db.Allcode,
                //     as: "priceTypeData",
                //     attributes: ["valueEn", "valueVi"]
                //   },
                //   // {
                //   //   model: db.Allcode,
                //   //   as: "provinceTypeData",
                //   //   attributes: ["valueEn", "valueVi"]
                //   // }


                // ]

              },
            },

          ],
          raw: false,
          nest: true

        });
        let abc = await db.Doctor_Infor.findOne({
          //where:{priceId:dataDoctor.Doctor_Infor.priceId},
          where: { doctorId: dataDoctor.id },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"]
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"]
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"]
            },
          ],
          raw: false
        })
        if (dataDoctor?.image) {
          dataDoctor.image = new Buffer(dataDoctor.image, "base64").toString(
            "binary"
          );
        }


        if (!dataDoctor) {
          dataDoctor = {};
        }



        res({
          errCode: 0,
          data: dataDoctor,
          abc: abc
        });
      }
    } catch (e) {
      rej(e);
    }
  });
};
let getExtraInforDoctorByIdService = (id) => {
  return new Promise(async (res, rej) => {
    try {
      if (!id) {
        res({
          errCode: 2,
          message: "missing parameter id doctor ",
        });
      } else {
        let abc = await db.Doctor_Infor.findOne({
          //where:{priceId:dataDoctor.Doctor_Infor.priceId},
          where: { doctorId: id },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"]
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueEn", "valueVi"]
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueEn", "valueVi"]
            },
          ],
          raw: false,
          nest: true
        })
        if (!abc) abc = {};
        res({
          errCode: 0,
          data: abc,

        });
      }
    } catch (e) {
      rej(e);
    }
  })
};
let handleUpdateInfoDoctorsService = (data) => {
  return new Promise(async (res, rej) => {
    try {
      if (
        !data?.selectedDoctor?.value ||
        !data.selectedPrice ||
        !data.selectedPayment ||
        !data.selectedProvince ||
        !data.nameClinic ||
        !data.addressClinic ||
        !data.note
      ) {
        res({
          errCode: 2,
          message: "missing parameter infor doctor update",
        });
      } else {
        let user = await db.Markdown.findOne({
          where: { doctorId: data?.selectedDoctor?.value },
          raw: false,
        });
        if (user) {
          user.contentHTML = data.contentHTML;
          user.contentMarkdown = data.contentMarkdown;
          user.des = data.des;
          user.upda;

          await user.save();
        }
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: { doctorId: data?.selectedDoctor?.value },
          raw: false,
        });

        if (doctorInfor) {
          //update
          doctorInfor.priceId = data.selectedPrice;
          doctorInfor.provinceId = data.selectedProvince;
          doctorInfor.paymentId = data.selectedPayment;
          doctorInfor.nameClinic = data.nameClinic;
          doctorInfor.addressClinic = data.addressClinic;
          doctorInfor.note = data.note;
          await doctorInfor.save();
        }
        res({
          errCode: 0,
          message: "update succ",
        });
      }
    } catch (e) {
      rej(e);
    }
  });
};

let postCreateManageScheduleService = (inputData) => {
  return new Promise(async (res, rej) => {
    try {
      let ManageSchedule = await db.Schedule.findAll({
        where: { doctorId: inputData[0].doctorId, date: inputData[0].date },
        // attributes: {
        //     exclude: ['password','image']
        // }
      });
      let resultCreateManageSchedule = inputData.map((item) => ({
        maxNumber: 10,
        date: item.date,
        timeType: item.keyMap,
        doctorId: item.doctorId,
      }));
      let checkAlreadyExist = (arr, item) => {
        let check = false;
        for (let i = 0; i < arr.length; i++) {
          if (item.timeType === arr[i].timeType) {
            check = true;
            break;
          }
        }
        return check;
      };
      // console.log("ManageSchedule", ManageSchedule[2], ManageSchedule.length);
      //console.log("resultCreateManageSchedule", resultCreateManageSchedule);
      let result = resultCreateManageSchedule.filter(
        (item) => checkAlreadyExist(ManageSchedule, item) === false
      );
      //   let result = _.differenceBy(resultCreateManageSchedule, ManageSchedule, [
      //     "timeType",
      //     "date",
      //   ]);

      console.log("result cuối cùng", result);
      await db.Schedule.bulkCreate(result);
      res({
        errCode: 0,
        data: "succ create  manage schedule",
      });
    } catch (e) {
      rej(e);
    }
  });
};
let getScheduleByDate = (id, date) => {
  return new Promise(async (res, rej) => {
    try {
      if (!id || !date) {
        res({
          errCode: 1,
          errMessage: "Missing para Schedule Doctor ",
        });
      } else {
        let ScheduleDoctor = await db.Schedule.findAll({
          where: { doctorId: id, date: date },
          include: [
            //{model: db.Allcode, as:'positionData',attributes:['valueEn','valueVi']},
            //{model: db.Allcode, as:'genderData',attributes:['valueEn','valueVi']}

            {
              model: db.Allcode,
              as: "dateData",
              attributes: ["valueEn", "valueVi"],
            },
            { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
          ],

          raw: false,
          nest: true,
        });

        if (!ScheduleDoctor) {
          dataDoctor = {};
        }
        res({
          errCode: 0,
          data: ScheduleDoctor,
        });
      }
    } catch (e) {
      rej(e);
    }
  });
};
let getProfileDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errcode: 1,
          errMessage: 'Missing required parameters id'
        })
      }
      else {
        let data = await db.User.findOne(
          {
            where: {
              id: id
            }, attributes: { exclude: ['password'] },
            include: [
              {
                model: db.Markdown,
                attributes: ['des', 'contentHTML', 'contentMarkdown']
              },
              {
                model: db.Allcode,
                as: "positionData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Doctor_Infor,
                attributes: {
                  exclude: ['id', "doctorId"]
                },
                include: [
                  {
                    model: db.Allcode,
                    as: "priceTypeData",
                    attributes: ["valueEn", "valueVi"]
                  },
                  {
                    model: db.Allcode,
                    as: "provinceTypeData",
                    attributes: ["valueEn", "valueVi"]
                  },
                  {
                    model: db.Allcode,
                    as: "paymentTypeData",
                    attributes: ["valueEn", "valueVi"]
                  },
                ],
              },
            ],
            raw: false,
            nest: true
          })
        if (data?.image) {
          data.image = new Buffer(data.image, "base64").toString(
            "binary"
          );
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data
        })
      }
    }
    catch (e) {
      reject(e);
    }
  });
}
let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'missing required parameters'
        })
      } else {
        // console.log('show time chưa chueyn63ss ',date)
        //console.log('show timesssssssss',new Date(date).toISOString());
        let data = await db.Booking.findAll({

          where: {
            statusId: 'S1',
            doctorId: doctorId,
            date: date
          },
          include: [
            {

              model: db.User, as: 'patientData',
              attributes: ['email', 'firstName', 'address', 'gender'],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                }
              ]
            },
            {
              model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
            }
          ],
          raw: false,
          nest: true
        })
        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (error) {
      reject(error);
    }
  })
}
let sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.patientId ||
        !data.timeType || !data.imgBase64) {
        resolve({
          errCode: 1,
          errMessage: 'missing required parameters'
        })
      }
      else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: 'S1'
          },
          raw: false
        })
        if (appointment) {
          appointment.statusId = 'S3';
          await appointment.save()
        }
        await emailService.sendAttachment(data);
        resolve({
          errCode: 0,
          errmessage: 'ok'
        })
      }
    }
    catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  getTopDoctorHomeService: getTopDoctorHomeService,
  getAllDoctors: getAllDoctors,
  DetailInforDoctor: DetailInforDoctor,
  getDetailDoctorByIdService: getDetailDoctorByIdService,
  handleUpdateInfoDoctorsService: handleUpdateInfoDoctorsService,
  postCreateManageScheduleService: postCreateManageScheduleService,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorByIdService: getExtraInforDoctorByIdService,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy:sendRemedy
};
