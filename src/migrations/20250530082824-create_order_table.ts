"use strict";
import { QueryInterface, DataTypes, Sequelize as SequelizeC } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
        await queryInterface.createTable("orders", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            userID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "CASCADE",
                defaultValue: -1,
            },
            productID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "product",
                    key: "id",
                },
                onDelete: "CASCADE",
                defaultValue: -1,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            totalPrice: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: SequelizeC.fn("NOW"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: SequelizeC.fn("NOW"),
            },
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable("orders");
    },
};
