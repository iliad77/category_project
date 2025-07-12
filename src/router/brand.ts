import { Request, Response, Router } from "express";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { Brand } from "../models";
import { IDmiddleware } from "../middleware/IDmiddlesware";
const router = Router();

router.post(
    "/brand",
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { name } = request.body;
            if (!name)
                return response.status(400).json({ msg: "bad credentials" });
            else {
                const brand = await Brand.create(
                    { name: name },
                    { returning: true }
                );
                return response
                    .status(200)
                    .json({ msg: `${brand.name} created successfully!` });
            }
        } catch (error) {
            return response.status(500).json((error as any).name);
        }
    }
);

router.get(
    "/brand",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const brand = await Brand.findAll();
            return response.status(200).json(brand);
        } catch (error) {
            return response.status(500).json((error as any).name);
        }
    }
);

router.get(
    "/brand/:id",
    IDmiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const id = (request as any).parsedID;
            const brand = await Brand.findByPk(id);
            if (!brand)
                return response
                    .status(404)
                    .json({ msg: "brand does not exist!" });
            return response.status(200).json(brand);
        } catch (error) {
            return response.status(500).json((error as any).name);
        }
    }
);

router.delete(
    "/brand/:id",
    IDmiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const id = (request as any).parsedID;
            const brand = await Brand.destroy({ where: { id: id } });
            return response
                .status(200)
                .json({ msg: `brand${brand} deleted successfully!` });
        } catch (error) {
            return response.status(500).json((error as any).name);
        }
    }
);

export default router;
