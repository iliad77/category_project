import { DataTypes, Model, Sequelize } from "sequelize";

class Cart extends Model {
    public id!: number;
    public UserId!: number;
    public totalprice!: number;
    public status!: string;
}

function Cartinit(sequelize: Sequelize) {
    Cart.init(
        {
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
        },
        {
            sequelize,
            modelName: "Cart",
            tableName: "carts",
        }
    );
    return Cart;
}
export { Cart, Cartinit };
