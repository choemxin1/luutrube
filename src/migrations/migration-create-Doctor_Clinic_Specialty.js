'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Doctor_Clinic_Specialty', {
      // ,
      // ,
      // date: Sequelize.DATE,
      // ,
      // doctorId:Sequelize.INTEGER,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type:  Sequelize.INTEGER
      },
      doctorID: {
        type: Sequelize.INTEGER
      },
      clinicID: {
        type: Sequelize.INTEGER
      },
      specialyID: {
        type: Sequelize.INTEGER
      },
      
      
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Doctor_Clinic_Specialty');
  }
};