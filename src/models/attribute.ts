import { Model, DataTypes, Sequelize } from "sequelize";

class Attributes extends Model {
    public id!: number;
    public name!: string;
    public category!: number;
    public subcategory!: number;
}

class ProductAttr extends Model {
    public id!: number;
    public productID!: number;
    public AttrID!: number;
    public value!: string;
}

function initAttr(sequelize: Sequelize) {
    Attributes.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: { type: DataTypes.STRING, allowNull: false },
            category: {
                type: DataTypes.INTEGER,
                references: { model: "category", key: "id" },
                onDelete: "CASCADE",
            },
            subcategory: {
                type: DataTypes.INTEGER,
                references: { model: "subcategory" },
                onDelete: "CASCADE",
            },
        },
        {
            sequelize,
            modelName: "Attributes",
            tableName: "attributes",
            timestamps: false,
        }
    );
    return Attributes;
}

function initProductAttr(sequelize: Sequelize) {
    ProductAttr.init(
        {
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
        },
        {
            sequelize,
            modelName: "ProductAttr",
            tableName: "productAttr",
            timestamps: false,
        }
    );
    return ProductAttr;
}

export { initAttr, Attributes, initProductAttr, ProductAttr };
