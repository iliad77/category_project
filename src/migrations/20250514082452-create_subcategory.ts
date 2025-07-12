"use strict";
import { QueryInterface } from "sequelize";
import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("subcategory", {
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
            categoryID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "category",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("subcategory");
    },
};
