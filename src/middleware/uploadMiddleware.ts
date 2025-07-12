import { NextFunction, Request, Response } from "express";
import { Files } from "../models/index";
import sharp from "sharp";
import path from "path";
import fs from "fs";

export const ChangeFormat = async function (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<any> {
    try {
        const files = (request as any).files;
        const file = request.file;
        if (!files && !file) {
            return next();
        }
        if (file) {
            const filename = path.parse(file.filename).name;
            const outputname = `${filename}.webp`;
            const outputpath = path.join(path.dirname(file.path), outputname);
            const thumbname = `${filename}_thumbnail.webp`;
            const thumpath = path.join(path.dirname(file.path), thumbname);
            await sharp(file.path).webp().toFile(outputpath);
            await sharp(file.path).resize(150, 150).webp().toFile(thumpath);
            fs.unlinkSync(file.path);
            (request as any).file.filename = outputname;
            (request as any).file.path = outputpath;
            (request as any).file.thumbname = thumbname;
            (request as any).file.thumpath = thumpath;
        }

        if (files) {
            const flatfiles: Express.Multer.File[] = Array.isArray(files)
                ? files
                : Object.values(files).flat();
            for (const file of flatfiles) {
                const name = path.parse(file.filename).name;
                const outname = `${name}.webp`;
                const outpath = path.join(path.dirname(file.path), outname);
                const thumbname = `${name}_thumbnail.webp`;
                const thumpath = path.join(path.dirname(file.path), thumbname);
                await sharp(file.path).webp().toFile(outpath);
                await sharp(file.path)
                    .resize(150, 150, { fit: "inside" })
                    .webp()
                    .toFile(thumpath);
                fs.unlinkSync(file.path);
                file.filename = outname;
                file.path = outpath;
                (file as any).thumbname = thumbname;
                (file as any).thumpath = thumpath;
            }
        }

        return next();
    } catch (error) {
        return response.json(error);
    }
};

export const uploadMiddleware = async function (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<any> {
    try {
        const file = request.file;
        const files = (request as any).files;
        const { id } = (request as any).user;

        if (!file && !files) return next();

        if (file) {
            const newfile = file.filename;

            await Files.create({
                userID: id,
                file: newfile,
            });
        }

        if (files) {
            const Flatfiles: Express.Multer.File[] = Array.isArray(files)
                ? files
                : Object.values(files).flat();
            for (const i of Flatfiles) {
                console.log("Multi-file upload:", i.filename);
                const newfile = i.filename;
                await Files.create({ userID: id, file: newfile });
            }
        }

        return next();
    } catch (error) {
        return response
            .status(500)
            .json({ error: "File logging failed", detail: error });
    }
};
