import { asIs } from "sequelize";
import doctorService from "../services/doctorService"
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let doctors = await doctorService.getTopDoctorHomeService(+limit);
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error sever'
        })
    }
}
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from get All doctor'
        })
    }
}
let postInfoDoctors = async (req, res) => {
    try {

        let response = await doctorService.DetailInforDoctor(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from save info doctor'
        })
    }
}
let getDetailDoctorById = async (req, res) => {
    try {

        let infoDoctor = await doctorService.getDetailDoctorByIdService(req.query.id);
        return res.status(200).json({
            ...infoDoctor,

        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from get info doctor by id'
        })
    }
}
let handleUpdateInfoDoctors = async (req, res) => {
    let data = req.body;
    try {
        let infoDoctor = await doctorService.handleUpdateInfoDoctorsService(data);
        return res.status(200).json(infoDoctor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from update info doctor '
        })
    }
}
let postCreateManageSchedule = async (req, res) => {
    try {

        let response = await doctorService.postCreateManageScheduleService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from save info doctor'
        })
    }
}
let getScheduleByDate = async (req, res) => {
    try {
        let ScheduleDoctor = await doctorService.getScheduleByDate(req.query.id, req.query.date);
        return res.status(200).json(ScheduleDoctor);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from get info doctor by id and date'
        })
    }
}
let getExtraInforDoctorById = async (req, res) => {
    try {
        console.log('check id doctor',req.query.doctorId)
        let infor = await doctorService.getExtraInforDoctorByIdService(req.query.doctorId);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e); 
        return res.status(200).json({ 
            errCode: -1, 
            errMessage: 'Error from the server.' })
    }
}
let getProfileDoctorById = async ( req, res) => {
    try {
        console.log('check id doctor',req.query.doctorId)
        let infor = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e); 
        return res.status(200).json({ 
            errCode: -1, 
            errMessage: 'Error from the server.' })
    }
}
let getListPatientForDoctor = async (req, res) => {
    try {
        let ScheduleDoctor = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
        return res.status(200).json(ScheduleDoctor);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from get info doctor by id and date'
        })
    }
}
let sendRemedy = async (req, res) => {
    try {
        let ScheduleDoctor = await doctorService.sendRemedy(req.body);
        return res.status(200).json(ScheduleDoctor);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from get info doctor by id and date'
        })
    }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctors: postInfoDoctors,
    getDetailDoctorById: getDetailDoctorById,
    handleUpdateInfoDoctors: handleUpdateInfoDoctors,
    postCreateManageSchedule: postCreateManageSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById:getProfileDoctorById,
    getListPatientForDoctor:getListPatientForDoctor,
    sendRemedy:sendRemedy
}