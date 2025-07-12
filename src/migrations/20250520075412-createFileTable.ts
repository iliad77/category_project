"use strict";
import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("files", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onDelete: "SET DEFAULT",
                onUpdate: "SET DEFAULT",
                defaultValue: -1,
            },
            file: { type: DataTypes.STRING, allowNull: false },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("files");
    },
};
