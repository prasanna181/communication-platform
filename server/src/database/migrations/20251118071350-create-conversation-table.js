"use strict";


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("conversations", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      type: {
        type: Sequelize.STRING,
        defaultValue: 'single',
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("conversations");
  },
};
