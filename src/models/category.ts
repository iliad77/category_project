import { Model, DataTypes, Sequelize } from "sequelize";

export class Category extends Model {
    public id!: number;
    public name!: string;
}

export function initCategory(sequelize: Sequelize): typeof Category {
    Category.init(
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
        },
        {
            sequelize,
            modelName: "Category",
            tableName: "category",
            timestamps: false,
        }
    );

    return Category;
}

export class Subcategory extends Model {
    public id!: number;
    public name!: string;
    public categoryID!: number;
}

export function initSubcategory(sequelize: Sequelize): typeof Subcategory {
    Subcategory.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            categoryID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Subcategory",
            tableName: "subcategory",
            timestamps: false,
        }
    );

    return Subcategory;
}
