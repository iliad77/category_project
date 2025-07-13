import NodeCache from "node-cache";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import dotenv from "dotenv";
// import { error } from "console";
// import { stderr, stdout } from "process";
dotenv.config();

const { DATABASE, DB_USERNAME, HOST, PASSWORD } = process.env;

const cache = new NodeCache({ stdTTL: 300 });

export const backupScript = () => {
    const timestamp = new Date().toString().replace(/[:.]/g, "-");
    const backupDir = path.join(
        "C:\\iliad\\python\\typeScript\\categories_proj\\backup"
    );

    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const filename = path.join(backupDir, `${timestamp}.dump`);

    const command = `pg_dump -U ${DB_USERNAME} -h ${HOST} -d ${DATABASE} -F c -f"${filename}"`;

    const env = {
        ...process.env,
        PGPASSWORD: PASSWORD,
    };
    exec(command, { env }, (error, stdout, stderr) => {
        if (error) console.error("error message : ", error.message);
        else console.log(`backup succesfully at ${backupDir}`);
    });
};

export default cache;
