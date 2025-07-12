"use strict";
import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("attributes", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: { type: DataTypes.STRING, allowNull: false },
            category: {
                type: DataTypes.INTEGER,
                references: { model: "category", key: "id" },
                onDelete: "CASCADE",
            },
            subcategory: {
                type: DataTypes.INTEGER,
                references: { model: "subcategory" },
                onDelete: "CASCADE",
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("attributes");
    },
};
