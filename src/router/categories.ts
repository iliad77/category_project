import { Request, Response, Router } from "express";
import { IDmiddleware } from "../middleware/IDmiddlesware";
import { Category, Subcategory } from "../models/index";
import { Attributes, ProductAttr } from "../models/attribute";
import { Product } from "../models/index";
import { Brand } from "../models/index";
import { Op } from "sequelize";

const router = Router();

router.get(
    "/categories",
    async (request: Request, response: Response): Promise<any> => {
        const { hide } = request.query;
        let include: Array<any> = [];
        if (!hide || hide === "0")
            include = [{ model: Subcategory, attributes: ["name"] }];

        const categories = await Category.findAll({
            include: include,
        });
        return response.status(200).json(categories);
    }
);

router.get(
    "/categories/cat/:id",
    IDmiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { ...filters } = request.query;
            const id = (request as any).parsedID;
            if (Object.entries(filters).length === 0) {
                const cat = await Category.findByPk(id);
                if (!cat)
                    return response
                        .status(404)
                        .json({ msg: "cat does not exist!" });
                const product = await Product.findAll({
                    where: { category: id },
                });
                if (product.length === 0)
                    return response
                        .status(400)
                        .json({ msg: "there is no product!" });
                return response.status(200).json(product);
            } else {
                const values: Array<any> = [];
                Object.entries(filters).map(([key, value]) =>
                    values.push(value)
                );
                const productattr = await ProductAttr.findAll({
                    where: { value: { [Op.in]: values } },
                });
                const productids = productattr.map((i) => i.id);
                const product = await Product.findAll({
                    where: {
                        [Op.and]: { id: { [Op.in]: productids }, category: id },
                    },
                });
                return response.status(200).json(product);
            }
        } catch (error) {
            return response.json(error);
        }
    }
);

router.get(
    "/categories/:category/:subcat",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { category, subcat } = request.params;
            const { ...filters } = request.query;
            const intCat = parseInt(category);
            const intSub = parseInt(subcat);
            if (isNaN(intCat) || isNaN(intSub))
                return response
                    .status(400)
                    .json({ msg: "invalid category or subcategory" });
            const whereC: any = {};
            if (category) whereC.category = intCat;
            if (subcat) whereC.subcategory = intSub;
            if (Object.entries(filters).length === 0) {
                const product = await Product.findAll({ where: whereC });
                return response.status(200).json(product);
            }

            const filter = Object.entries(filters).map(([key, value]) => ({
                include: [
                    {
                        model: ProductAttr,
                        where: { value },
                        include: [
                            {
                                model: Attributes,
                                where: { name: key },
                                attributes: [],
                            },
                        ],
                        attributes: [],
                    },
                ],
            }));

            const product = await Product.findAll({
                where: { subcategory: intSub },
                include: filter,
            });
            return response.status(200).json(product);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.get(
    "/categories/product",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const {
                category,
                subcategory,
                brand,
                limit,
                page,
                name,
                price,
                maxprice,
                minprice,
                search,
                ...filters
            } = request.query;
            if (
                !category &&
                !subcategory &&
                !brand &&
                !page &&
                !limit &&
                !name &&
                !price &&
                !maxprice &&
                !minprice &&
                !search
            ) {
                const products = await Product.findAll();
                return response.status(200).json(products);
            }
            let ordering: "ASC" | "DESC" = "ASC";
            let order = "id";

            if (name === "ASC" || name === "DESC") {
                order = "name";
                ordering = name;
            } else if (price === "ASC" || price === "DESC") {
                order = "price";
                ordering = price;
            }
            const whereCluase: any = {};
            if (category) {
                const intcategory = parseInt(category as any);
                if (!isNaN(intcategory)) {
                    const existingCategory = await Category.findByPk(
                        intcategory
                    );
                    if (!existingCategory) {
                        return response.status(400).json({
                            msg: "The provided category does not exist.",
                        });
                    }
                    whereCluase.category = intcategory;
                }
            }
            if (subcategory) {
                const intsubcat = parseInt(subcategory as any);
                if (!isNaN(intsubcat)) {
                    const existingSubcategory = await Subcategory.findByPk(
                        intsubcat
                    );
                    if (!existingSubcategory) {
                        return response.status(400).json({
                            msg: "The provided subcategory does not exist.",
                        });
                    }
                    whereCluase.subcategory = intsubcat;
                }
            }
            if (maxprice)
                whereCluase.price = {
                    ...whereCluase.price,
                    [Op.lte]: maxprice,
                };
            if (minprice)
                whereCluase.price = {
                    ...whereCluase.price,
                    [Op.gte]: minprice,
                };
            if (search) {
                const keyword = `%${search}%`;
                const Orcondition = [{ name: { [Op.iLike]: keyword } }];
                const subcat = await Subcategory.findAll({
                    where: { name: { [Op.iLike]: keyword } },
                });
                const brand = await Brand.findAll({
                    where: { name: { [Op.iLike]: keyword } },
                });
                const subcatids = [];
                const brandids = [];
                for (const i in subcat) subcatids.push(subcat[i].id);
                for (const i in brand) brandids.push(brand[i].name);
                if (subcatids.length !== 0)
                    Orcondition.push({
                        subcategory: { [Op.in]: subcatids },
                    } as any);
                if (brandids.length !== 0)
                    Orcondition.push({
                        brandname: { [Op.in]: brandids },
                    } as any);
                whereCluase[Op.or] = Orcondition;
            }
            const filter = Object.entries(filters);
            const includeAttrFilters = filter.map(([key, value]) => ({
                model: ProductAttr,
                required: true,
                include: [
                    {
                        model: Attributes,
                        where: { name: key },
                        attributes: [],
                    },
                ],
                where: { value },
                attributes: [],
            }));

            const showAttr = {
                model: ProductAttr,
                required: false,
                include: [
                    {
                        model: Attributes,
                        required: false,
                        attributes: ["name"],
                    },
                ],
                attributes: ["value"],
            };

            console.log(whereCluase);

            const Intlimit = parseInt(limit as any) || 10;
            const Intpage = parseInt(page as any) || 1;

            const product = await Product.findAll({
                where: whereCluase,
                order: [[order, ordering]],
                limit: Intlimit,
                offset: Intlimit * (Intpage - 1),
                include: [
                    ...includeAttrFilters,
                    showAttr,
                    {
                        model: Brand,
                        attributes: ["name"],
                        required: false,
                    },
                    {
                        model: Category,
                        attributes: ["name"],
                        include: [
                            {
                                model: Subcategory,
                                attributes: ["name"],
                                required: false,
                            },
                        ],
                    },
                ],
                attributes: ["name", "price", "cover", "gallery", "inventory"],
            });
            if (product.length === 0)
                return response.json({ msg: "there is no product" });
            return response.status(200).json(product);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.post("/categories", async (request: Request, response: Response) => {
    const { name } = request.body;
    console.log(request.body);
    await Category.create({ name });
    response.status(200).send({ msg: "category created successfully!" });
});

router.patch(
    "/categories/:id",
    IDmiddleware,
    async (request: Request, response: Response) => {
        const id: number = (request as any).parsedID;
        if (!(await Category.findByPk(id)))
            response.status(404).send({ msg: "category does not exist!" });
        await Category.update(
            { name: request.body.name },
            { where: { id: id }, returning: true }
        );
        response.status(200).send({ msg: "category updated successfully!" });
    }
);

router.delete(
    "/categories/:id",
    IDmiddleware,
    async (request: Request, response: Response) => {
        const id: number = (request as any).parsedID;
        if (!(await Category.findByPk(id)))
            response.status(404).send({ msg: "category not found!" });
        await Category.destroy({ where: { id: id } });
        response.status(200).send({ msg: "category deleted successfully!" });
    }
);

export default router;
