import { Request, Response, Router } from "express";
import { Attributes, ProductAttr } from "../models/attribute";
import cache from "../utils";
const router = Router();

router.post(
    "/attributes",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const cachekey = "attr";
            const cachedata = cache.get(cachekey);
            if (cachedata) return response.json(cachedata);
            const { name, category, subcategory } = request.body;
            const attribute = await Attributes.create(
                { name: name, category: category, subcategory: subcategory },
                { returning: true }
            );
            cache.set(cachekey, attribute, 240);
            return response.status(200).json(attribute);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.get(
    "/attributes",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const attribute = await Attributes.findAll();
            return response.status(200).json(attribute);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.post(
    "/ProductAttr",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { productID, AttrID, value } = request.body;
            const productAttr = await ProductAttr.create(
                { productID: productID, AttrID: AttrID, value: value },
                { returning: true }
            );
            return response.status(200).json(productAttr);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.get(
    "/ProductAttr",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const productAttr = await ProductAttr.findAll();
            return response.status(200).json(productAttr);
        } catch (error) {
            return response.json(error);
        }
    }
);

export default router;
