"use strict";
import { QueryInterface, DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.createTable("productAttr", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            productID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "product", key: "id" },
            },
            AttrID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "attributes", key: "id" },
            },
            value: { type: DataTypes.STRING },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable("productAttr");
    },
};
