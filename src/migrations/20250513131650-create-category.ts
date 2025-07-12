"use strict";
import { QueryInterface } from "sequelize";
import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("category", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("category");
    },
};
