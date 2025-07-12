"use strict";
import { Sequelize } from "sequelize";
import { initCategory, initSubcategory } from "./category";
import { initUser } from "./users";
import { initProduct } from "./products";
import { initFiles } from "./files";
import { initBrand } from "./brand";
import { OrderInIt } from "./orderProduct";
import { initInventory } from "./inventory";
import { initProductAttr, initAttr } from "./attribute";
import { initMenu } from "./MenuModel";
import { productHistoryinit } from "./products";
import dotenv from "dotenv";

dotenv.config();

const { DATABASE, DB_USERNAME, PASSWORD } = process.env;
if (!DATABASE || !DB_USERNAME || !PASSWORD) {
    throw new Error("missing required environment variables!");
}

export const sequelize = new Sequelize(DATABASE, DB_USERNAME, PASSWORD, {
    host: "localhost",
    dialect: "postgres",
    logging: console.log,
});

const Category = initCategory(sequelize);
const Subcategory = initSubcategory(sequelize);
const User = initUser(sequelize);
const Product = initProduct(sequelize);
const Files = initFiles(sequelize);
const Brand = initBrand(sequelize);
const Order = OrderInIt(sequelize);
const Inventory = initInventory(sequelize);
const Attributes = initAttr(sequelize);
const ProductAttr = initProductAttr(sequelize);
const Menu = initMenu(sequelize);
const ProductHistory = productHistoryinit(sequelize);

Category.hasMany(Subcategory, { foreignKey: "categoryID" });
Subcategory.belongsTo(Category, { foreignKey: "categoryID" });

Category.hasMany(Product, { foreignKey: "category" });
Product.belongsTo(Category, { foreignKey: "category" });

Subcategory.hasMany(Product, { foreignKey: "subcategory" });
Product.belongsTo(Subcategory, { foreignKey: "subcategory" });

Files.belongsTo(User, { foreignKey: "userID" });
User.hasMany(Files, { foreignKey: "userID" });

Product.belongsTo(Files, { foreignKey: "cover" });
Files.hasMany(Product, { foreignKey: "cover" });

Brand.hasMany(Product, { foreignKey: "brandname", sourceKey: "name" });
Product.belongsTo(Brand, { foreignKey: "brandname", targetKey: "name" });

User.hasMany(Order, { foreignKey: "userID" });
Order.belongsTo(User, { foreignKey: "userID" });

Product.hasMany(Order, { foreignKey: "productID" });
Order.belongsTo(Product, { foreignKey: "productID" });

Product.hasOne(Inventory, { foreignKey: "productID" });
Inventory.belongsTo(Product, { foreignKey: "productID" });

Attributes.belongsTo(Category, { foreignKey: "category" });
Category.hasMany(Attributes, { foreignKey: "category" });

Subcategory.hasMany(Attributes, { foreignKey: "subcategory" });
Attributes.belongsTo(Subcategory, { foreignKey: "subcategory" });

ProductAttr.belongsTo(Attributes, { foreignKey: "AttrID" });
Attributes.hasMany(ProductAttr, { foreignKey: "AttrID" });

ProductAttr.belongsTo(Product, { foreignKey: "productID" });
Product.hasMany(ProductAttr, { foreignKey: "productID" });

Product.hasMany(ProductHistory, { foreignKey: "productid" });
ProductHistory.belongsTo(Product, { foreignKey: "productid" });

export {
    Category,
    Subcategory,
    User,
    Files,
    Brand,
    Order,
    Inventory,
    Product,
    Attributes,
    ProductAttr,
    Menu,
    ProductHistory,
};
