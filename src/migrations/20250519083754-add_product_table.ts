"use strict";
import { QueryInterface, DataTypes } from "sequelize";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("product", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: { type: DataTypes.STRING, allowNull: false },
            price: { type: DataTypes.INTEGER, allowNull: false },
            gallery: {
                type: DataTypes.ARRAY(DataTypes.INTEGER),
            },
            cover: {
                type: DataTypes.INTEGER,
                references: {
                    model: "files",
                    key: "id",
                },
                onDelete: "SET NULL",
            },
            category: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "category",
                    key: "id",
                },
                defaultValue: -1,
                onUpdate: "SET DEFAULT",
                onDelete: "SET DEFAULT",
            },
            subcategory: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "subcategory",
                    key: "id",
                },
                defaultValue: -1,
                onUpdate: "SET DEFAULT",
                onDelete: "SET DEFAULT",
            },
            brand: {
                type: DataTypes.STRING,
                references: { model: "brand", key: "name" },
                onDelete: "SET NULL",
            },
            status: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("product");
    },
};
