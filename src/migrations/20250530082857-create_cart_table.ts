"use strict";

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("carts", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            UserId: {
                type: DataTypes.INTEGER,
                references: { model: "users", key: "id" },
                allowNull: false,
            },
            totalprice: {
                type: DataTypes.FLOAT,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: "pending",
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("carts");
    },
};
