"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING,
      },

      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING,
        unique: true,
      },

      password_hash: {
        type: Sequelize.STRING,
      },

      role: {
        type: Sequelize.STRING,
      },

      mobile: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },

      otpVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      passwordUpdatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      district: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      cityOrVillage: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      pinCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      profilePicture: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      bio: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("users");
  },
};
