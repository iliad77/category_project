"use strict";

import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("inventory", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            productID: {
                type: DataTypes.INTEGER,
                references: { model: "product", key: "id" },
                onDelete: "CASCADE",
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("inventory");
    },
};
