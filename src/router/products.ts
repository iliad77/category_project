import { Request, Response, Router } from "express";
const router = Router();
import { IDmiddleware } from "../middleware/IDmiddlesware";
import { AuthMiddleware } from "../middleware/authMiddleware";
import {
    Brand,
    Category,
    Subcategory,
    Product,
    sequelize,
} from "../models/index";
import { Attributes, ProductAttr } from "../models/index";
import { Op } from "sequelize";
import { ProductHistory } from "../models/products";

//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
router.get(
    "/products",
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

            // If no filters, return all products
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
                !search &&
                Object.keys(filters).length <= 0
            ) {
                const products = await Product.findAll();
                return response.status(200).json(products);
            }

            // Sorting logic
            let ordering: "ASC" | "DESC" = "ASC";
            let order: string = "id";

            if (name === "ASC" || name === "DESC") {
                order = "name";
                ordering = name;
            } else if (price === "ASC" || price === "DESC") {
                order = "price";
                ordering = price;
            }

            const whereClause: any = {};

            // Category check
            if (category) {
                const intCategory = parseInt(category as string);
                if (!isNaN(intCategory)) {
                    const existing = await Category.findByPk(intCategory);
                    if (!existing) {
                        return response
                            .status(400)
                            .json({ msg: "Invalid category." });
                    }
                    whereClause.category = intCategory;
                } else
                    return response
                        .status(400)
                        .json({ msg: "invalid category" });
            }

            // Subcategory check
            if (subcategory) {
                const intSubcat = parseInt(subcategory as string);
                if (!isNaN(intSubcat)) {
                    const existing = await Subcategory.findByPk(intSubcat);
                    if (!existing) {
                        return response
                            .status(400)
                            .json({ msg: "Invalid subcategory." });
                    }
                    whereClause.subcategory = intSubcat;
                } else
                    return response
                        .status(400)
                        .json({ msg: "invalid subcategory" });
            }

            // Price filters
            if (maxprice) {
                whereClause.price = {
                    ...whereClause.price,
                    [Op.lte]: parseFloat(maxprice as string),
                };
            }
            if (minprice) {
                whereClause.price = {
                    ...whereClause.price,
                    [Op.gte]: parseFloat(minprice as string),
                };
            }

            //brand filter
            if (brand) {
                whereClause.brandname = brand;
            }

            // Search logic
            if (search) {
                const keyword = `%${search}%`;
                const orConditions: any[] = [{ name: { [Op.iLike]: keyword } }];

                const subcategories = await Subcategory.findAll({
                    where: { name: { [Op.iLike]: keyword } },
                });
                const brands = await Brand.findAll({
                    where: { name: { [Op.iLike]: keyword } },
                });

                const subcatIds = subcategories.map((s) => s.id);
                const brandNames = brands.map((b) => b.name);

                if (subcatIds.length > 0) {
                    orConditions.push({ subcategory: { [Op.in]: subcatIds } });
                }
                if (brandNames.length > 0) {
                    orConditions.push({ brandname: { [Op.in]: brandNames } });
                }

                whereClause[Op.or] = orConditions;
            }

            // Dynamic attribute filters
            const includeAttrFilters = Object.entries(filters).map(
                ([key, value]) => ({
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
                })
            );
            // console.log(includeAttrFilters[0].include);

            //show attribute for products
            const showAttr = {
                model: ProductAttr,
                required: false,
                include: [
                    {
                        model: Attributes,
                        required: true,
                        attributes: ["name"],
                    },
                ],
                attributes: ["value"],
            };

            console.log(showAttr);

            const intLimit = parseInt(limit as string) || 10;
            const intPage = parseInt(page as string) || 1;

            const products = await Product.findAll({
                where: whereClause,
                order: [[order, ordering]],
                limit: intLimit,
                offset: intLimit * (intPage - 1),
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

            if (products.length === 0) {
                return response
                    .status(404)
                    .json({ msg: "There are no products." });
            }

            return response.status(200).json(products);
        } catch (error) {
            console.error("Product fetch error:", error);
            return response.status(500).json({ error });
        }
    }
);
//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------
router.get(
    "/product",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { name, price, category, subcategory, ...filters } =
                request.query;
            const intcategory = parseInt(category as any);
            const intsubcat = parseInt(subcategory as string);

            let ordering: "ASC" | "DESC" = "ASC";
            let order = "id";

            if (name === "ASC" || name === "DESC") {
                order = "name";
                ordering = name;
            } else if (price === "ASC" || price === "DESC") {
                order = "price";
                ordering = price;
            }
            if (!category && !subcategory) {
                const product = await Product.findAll();
                return response.status(200).json(product);
            }

            const whereClause: any = {};
            if (!isNaN(intcategory)) {
                const existingCategory = await Category.findByPk(intcategory);
                if (!existingCategory) {
                    return response.status(400).json({
                        msg: "The provided category does not exist.",
                    });
                }
                whereClause.category = intcategory;
            }

            if (!isNaN(intsubcat)) {
                const existingSubcategory = await Subcategory.findByPk(
                    intsubcat
                );
                if (!existingSubcategory) {
                    return response.status(400).json({
                        msg: "The provided subcategory does not exist.",
                    });
                }
                whereClause.subcategory = intsubcat;
            }
            console.log(whereClause);
            if (Object.keys(filters).length === 0) {
                const product = await Product.findAll({
                    where: whereClause,
                    include: [
                        {
                            model: Category,
                            attributes: ["name"],
                            include: [
                                {
                                    model: Subcategory,
                                    attributes: ["name"],
                                },
                            ],
                        },
                    ],
                });
                if (!product || product.length === 0)
                    return response.status(404).json({
                        msg: "there is no product in this category",
                    });
                return response.status(200).json(product);
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

            const product = await Product.findAll({
                where: whereClause,
                order: [[order, ordering]],
                include: [
                    ...includeAttrFilters,
                    {
                        model: Brand,
                        attributes: ["name"],
                        required: false,
                        separate: true,
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
            return response.status(200).json(product);
        } catch (error) {
            return response.status(500).json(error as any);
        }
    }
);
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

router.get(
    "/product/:id",
    IDmiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const product = await Product.findByPk((request as any).parsedID);
            if (!product || product.status === -1)
                return response
                    .status(404)
                    .json({ msg: "produnct does not exist!" });
            return response.status(200).json(product);
        } catch (error) {
            return response.status(500).json((error as any).name);
        }
    }
);

router.post(
    "/product",
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const {
                name,
                price,
                category,
                subcategory,
                inventory,
                cover,
                gallery,
                brandname,
            } = (request as any).body;

            if (!name && !price && !category && !subcategory && !inventory)
                return response.status(400).json({ msg: "bad credential!" });
            const postedField = {
                ...(name && { name }),
                ...(price && { price }),
                ...(category && { category }),
                ...(subcategory && { subcategory }),
                ...(inventory && { inventory }),
                ...(cover && { cover }),
                ...(gallery && { gallery }),
                ...(brandname && { brandname }),
            };
            console.log(postedField);
            const product = await Product.create(postedField, {
                returning: [
                    "id",
                    "name",
                    "price",
                    "inventory",
                    "gallery",
                    "cover",
                    "category",
                    "subcategory",
                    "brandname",
                    "status",
                ],
            });
            return response
                .status(200)
                .json({ msg: "product added successfully!", product });
        } catch (error) {
            return response.status(500).json((error as any).name);
        }
    }
);

router.patch(
    "/product/:id",
    IDmiddleware,
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        const transaction = await sequelize.transaction();
        try {
            const {
                name,
                price,
                category,
                subcategory,
                inventory,
                cover,
                gallery,
                brandname,
            } = request.body;
            if (
                !name &&
                !price &&
                !category &&
                !subcategory &&
                !cover &&
                !gallery &&
                !brandname &&
                !inventory
            )
                return response
                    .status(400)
                    .json({ msg: "at least one field must be provided!" });
            const updatedfield: { [key: string]: any } = {};
            const id = (request as any).parsedID;
            for (const key in request.body) {
                updatedfield[key] = request.body[key];
            }
            const product = await Product.findByPk(id, { transaction });
            if (!product) {
                await transaction.rollback();
                return response.status(404).json({ msg: "Product not found!" });
            }
            if (name || price) {
                const namevar = name || product?.name;
                const pricevar = price || product?.price;
                const productversion: number = await ProductHistory.max(
                    "version",
                    { where: { productid: id } }
                );
                const version = productversion ? productversion + 1 : 1;

                await ProductHistory.create(
                    {
                        productid: id,
                        name: namevar,
                        price: pricevar,
                        version: version,
                    },
                    { transaction }
                );
            }
            const [updatecount, object] = await Product.update(updatedfield, {
                where: { id: id },
                returning: true,
                transaction,
            });

            if (updatecount === 0) {
                await transaction.rollback();
                return response.status(404).json({ msg: "product not found!" });
            }
            await transaction.commit();
            return response.status(200).json(object);
        } catch (error) {
            await transaction.rollback();
            return response.status(500).json(error);
        }
    }
);
router.delete(
    "/product/:id",
    AuthMiddleware,
    IDmiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const id = (request as any).parsedID;
            const product = await Product.findByPk(id);
            if (!product)
                return response
                    .status(404)
                    .json({ msg: "product does not exist !" });
            else {
                await Product.update({ status: -1 }, { where: { id: id } });
                return response
                    .status(200)
                    .json({ msg: "product deleted successfully!" });
            }
        } catch (error) {
            return response.status(500).json((error as any).name);
        }
    }
);

router.get(
    "/producthistory",
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const producthistory = await ProductHistory.findAll();
            if (producthistory.length === 0)
                return response
                    .status(404)
                    .json({ msg: "no record was found!" });
            return response.status(200).json(producthistory);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.get(
    "/producthistory/:id",
    AuthMiddleware,
    IDmiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const id = (request as any).parsedID;
            const records = await ProductHistory.findAll({
                where: { productid: id },
            });
            if (records.length === 0)
                return response
                    .status(404)
                    .json({ msg: "no record on this product" });
            return response.status(200).json(records);
        } catch (error) {
            return response.json(error);
        }
    }
);

router.post(
    "/revertproduct/:id",
    AuthMiddleware,
    IDmiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const id = (request as any).parsedID;
            const { version } = request.body;
            const productRecord = await ProductHistory.findOne({
                where: { productid: id, version: version },
            });
            if (!productRecord)
                return response
                    .status(404)
                    .json({ msg: "no such record found!" });
            const updateField: { [key: string]: any } = {};
            if (productRecord.name) updateField.name = productRecord.name;
            if (productRecord.price) updateField.price = productRecord.price;
            const product = await Product.update(updateField, {
                where: { id: id },
                returning: true,
            });
            return response.status(200).json(product);
        } catch (error) {
            return response.json(error);
        }
    }
);

export const raise = async function () {
    const product = await Product.findOne({ where: { id: 10 } });
    const inventory = product?.inventory! + 1;
    await Product.update({ inventory: inventory }, { where: { id: 10 } });
    console.log(inventory);
};

export default router;
