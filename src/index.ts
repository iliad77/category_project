import express, { json } from "express";
import Catrouter from "./router/categories";
import SubCat from "./router/subcategories";
import UserRouter from "./router/users";
import ProductRouter from "./router/products";
import uploadRouter from "./router/uploadRouter";
import brandRouter from "./router/brand";
import orderRouter from "./router/cart_order";
import attributeRouter from "./router/attribute";
import menuRouter from "./router/menu";
import cron from "node-cron";
import { raise } from "./router/products";
import { backupScript } from "./utils";

import dotenv from "dotenv";
import { sequelize } from "./models";
dotenv.config();

const app = express();

app.use(json());
app.use("/api/v0", Catrouter);
app.use("/api/v0", SubCat);
app.use("/api/v0", UserRouter);
app.use("/api/v0", ProductRouter);
app.use("/api/v0", uploadRouter);
app.use("/api/v0", brandRouter);
app.use("/api/v0", orderRouter);
app.use("/api/v0", attributeRouter);
app.use("/api/v0", menuRouter);

const port: number = 3000;

cron.schedule("*/30 * * * * *", raise);
cron.schedule("0 * * * *", backupScript);

sequelize
    .authenticate()
    .then(() => console.log("Connected to new_db!"))
    .catch((err) => console.error("Failed to connect:", err));

app.listen(port, () => {
    console.log(`Running server on PORT:${port}`);
});
