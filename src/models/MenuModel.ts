import { Model, DataTypes, Sequelize } from "sequelize";

class Menu extends Model {
    public id!: number;
    public name!: string;
    public url!: string;
}

function initMenu(sequelize: Sequelize) {
    Menu.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Menu",
            tableName: "Menu",
            timestamps: false,
        }
    );
    return Menu;
}

export { initMenu, Menu };
