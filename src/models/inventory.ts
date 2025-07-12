import { DataTypes, Model, Sequelize } from "sequelize";

class Inventory extends Model {
    public id!: number;
    public productID!: number;
    public quantity!: number;
}

function initInventory(sequelize: Sequelize) {
    Inventory.init(
        {
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
        },
        {
            sequelize,
            modelName: "Inventory",
            tableName: "inventory",
        }
    );
    return Inventory;
}

export { Inventory, initInventory };
