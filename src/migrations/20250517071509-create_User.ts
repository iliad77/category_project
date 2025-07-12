"use strict";
import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("users", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            profile_pic: {
                type: DataTypes.INTEGER,
                // references: { model: "files", key: "id" },
            },
            email: { type: DataTypes.STRING },
            password: { type: DataTypes.STRING, allowNull: false },
            status: { type: DataTypes.INTEGER, defaultValue: 1 },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("users");
    },
};
