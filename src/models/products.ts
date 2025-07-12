import { Model, Sequelize, DataTypes } from "sequelize";

class Product extends Model {
    public id!: number;
    public name!: string;
    public price!: number;
    public inventory!: number;
    public cover!: string;
    public gallery!: Array<number>;
    public category!: number;
    public subcategory!: number;
    public status!: number;
}

function initProduct(sequelize: Sequelize) {
    Product.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: { type: DataTypes.STRING, allowNull: false },
            price: { type: DataTypes.INTEGER, allowNull: false },
            inventory: { type: DataTypes.INTEGER, allowNull: false },
            gallery: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
            cover: {
                type: DataTypes.STRING,
                references: { model: "files", key: "id" },
            },
            category: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: -1,
                references: { model: "category", key: "id" },
            },
            subcategory: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: -1,
                references: { model: "subcategory", key: "id" },
            },
            brandname: {
                type: DataTypes.STRING,
                references: {
                    model: "brand",
                    key: "name",
                },
                onDelete: "SET NULL",
            },
            status: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
        },
        {
            sequelize,
            modelName: "product",
            tableName: "product",
            timestamps: false,
        }
    );
    return Product;
}

class ProductHistory extends Model {
    public id!: number;
    public productid!: number;
    public name!: string;
    public price!: number;
    public version!: number;
}

function productHistoryinit(sequelize: Sequelize) {
    ProductHistory.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            productid: {
                type: DataTypes.INTEGER,
                references: { model: "product", key: "id" },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            version: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "producthistory",
            tableName: "producthistory",
            timestamps: true,
        }
    );
    return ProductHistory;
}
export { initProduct, Product, productHistoryinit, ProductHistory };
