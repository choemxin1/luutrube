'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Markdown.hasOne(models.User, { foreignKey: 'id'})

    }
  };
  Markdown.init({
    contentHTML: DataTypes.TEXT('long'),
    contentMarkdown : DataTypes.STRING('long'),
    des: DataTypes.TEXT('long'),
    doctorId:DataTypes.INTEGER,
    specialtyId:DataTypes.INTEGER,
    clinicId:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Markdown',
  });
  return Markdown;
};