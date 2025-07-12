import { Router, Request, Response } from "express";
const router = Router();
import { AuthMiddleware } from "../middleware/authMiddleware";
import { ChangeFormat } from "../middleware/uploadMiddleware";
import upload from "../middleware/uploadhandler";
import { Files } from "../models/index";

router.post(
    "/upload",
    AuthMiddleware,
    upload.fields([{ name: "single", maxCount: 1 }, { name: "gallery" }]),
    ChangeFormat,
    async (request: Request, response: Response): Promise<any> => {
        const files = request.files;
        const { id } = (request as any).user;
        console.log("uploading ...");

        try {
            if (files) {
                const flatfile: Express.Multer.File[] = Array.isArray(files)
                    ? files
                    : Object.values(files).flat();
                const FilesID: Array<number> = [];
                for (const file of flatfile) {
                    const newfile = await Files.create(
                        {
                            userID: id,
                            file: file.filename,
                        },
                        { returning: true }
                    );
                    FilesID.push(newfile.id);
                }
                return response.status(200).json({
                    msg: "files uploaded successfully!",
                    fileID: FilesID,
                });
            }
        } catch (error) {
            return response.status(400).json((error as any).name);
        }
    }
);

export default router;
