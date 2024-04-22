"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Infor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'positionID', targetKey:'keyMap',as:'positionData'})
      // Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey:'keyMap', as:'genderData'})
       Doctor_Infor.belongsTo(models.User, { foreignKey: 'doctorId'})
      Doctor_Infor.belongsTo(models.Allcode, {foreignKey:"doctorId"})
        Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData'}) 
        Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'provinceId', targetKey: 'keyMap' , as: 'provinceTypeData'})
         Doctor_Infor.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap' , as: 'paymentTypeData'})

    }
  }
  Doctor_Infor.init(
    {
      doctorId: DataTypes.STRING,
      priceId: DataTypes.STRING,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doctor_Infor",
    }
  );
  return Doctor_Infor;
};
