import { Router, Response, Request } from "express";
import { Menu } from "../models/index";
import { Category, Subcategory } from "../models";
import { Brand } from "../models";
import { IDmiddleware } from "../middleware/IDmiddlesware";
import cache from "../utils";

const router = Router();

router.get(
    "/menu",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const cacheKey = "menu";
            const cacheData = cache.get(cacheKey);
            if (cacheData) return response.json(cacheData);
            const staticLinks = await Menu.findAll();
            const category = await Category.findAll({
                include: [{ model: Subcategory, attributes: ["id", "name"] }],
            });
            const brands = await Brand.findAll();
            const data = { staticLinks, category, brands };
            cache.set(cacheKey, data, 240);
            return response.json(data);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.post(
    "/menu",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { name, url } = request.body;
            const staticLinks = await Menu.create(
                { name: name, url: url },
                { returning: true }
            );
            return response.status(200).json(staticLinks);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.patch(
    "/menu/:id",
    IDmiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { name, url } = request.body;
            const id = (request as any).parsedID;
            const updated: object = {};
            if (name) {
                const staticLinks = await Menu.update(
                    { name: name },
                    { where: { id: id }, returning: true }
                );
                Object.assign(updated, staticLinks);
            }
            if (url) {
                const staticLinks = await Menu.update(
                    { url: url },
                    { where: { id: id }, returning: true }
                );
                Object.assign(updated, staticLinks);
            }
            return response.status(200).json(updated);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.delete(
    "/menu/:id",
    IDmiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const id = (request as any).parsedID;
            await Menu.destroy({ where: { id: id } });
            return response.status(200).json({ msg: "deleted successfully!" });
        } catch (error) {
            return response.json(error);
        }
    }
);

export default router;
