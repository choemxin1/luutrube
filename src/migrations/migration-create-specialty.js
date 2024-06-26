'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('specialties', {
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
      descriptionHTML: {
        
        type: Sequelize.TEXT('long')
      },
      descriptionMarkdown: {
        
        type: Sequelize.TEXT('long')
      },
      image: {
        type: Sequelize.BLOB('long'),
      },
      name: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('specialties');
  }
};