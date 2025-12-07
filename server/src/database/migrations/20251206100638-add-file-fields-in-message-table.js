"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("messages", "type", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "text",
    });

    await queryInterface.addColumn("messages", "fileType", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("messages", "fileSize", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("messages", "originalName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("messages", "type");
    await queryInterface.removeColumn("messages", "fileType");
    await queryInterface.removeColumn("messages", "fileSize");
    await queryInterface.removeColumn("messages", "originalName");
  },
};
