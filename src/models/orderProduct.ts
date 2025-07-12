import { DataTypes, Sequelize, Model } from "sequelize";

class Order extends Model {
    public id!: number;
    public userID!: number;
    public productID!: number;
    public quantity!: number;
    public totalPrice!: number;
}

function OrderInIt(sequelize: Sequelize) {
    Order.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onDelete: "CASCADE",
            },
            productID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "product", key: "id" },
                onDelete: "CASCADE",
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            totalPrice: {
                type: DataTypes.FLOAT,
            },
        },
        {
            sequelize,
            modelName: "Order",
            tableName: "orders",
        }
    );
    return Order;
}
export { Order, OrderInIt };
