import { Request, Response, Router } from "express";
import { IDmiddleware } from "../middleware/IDmiddlesware";
import { Category, Subcategory } from "../models/index";

const router = Router();

router.get("/subcategories", async (_request: Request, response: Response) => {
    const categories = await Subcategory.findAll();
    response.status(200).send(categories);
});
router.get(
    "/subcategories/:id",
    IDmiddleware,
    async (request: Request, response: Response) => {
        const id = (request as any).parsedID;
        const subcategory = await Subcategory.findOne({
            where: { id: id },
            include: { model: Category, attributes: ["name"] },
        });
        if (!(await Subcategory.findByPk(id)))
            response.status(404).send({ msg: "Subcategory not found!" });
        response.status(200).send(subcategory);
    }
);

router.post(
    "/subcategories/:id",
    IDmiddleware,
    async (request: Request, response: Response) => {
        const { name } = request.body;
        const id = (request as any).parsedID;
        if (!(await Category.findByPk(id)))
            response.status(404).send({
                msg: "Subcategory must be related to existing category!",
            });
        await Subcategory.create({ name: name, categoryID: id });
        response.status(200).send({ msg: "Subcategory created successfully!" });
    }
);

router.patch(
    "/subcategories/:id",
    IDmiddleware,
    async (request: Request, response: Response) => {
        const id: number = (request as any).parsedID;
        if (!(await Subcategory.findByPk(id)))
            response.status(404).send({ msg: "Subcategory does not exist!" });
        await Subcategory.update(
            { name: request.body.name },
            { where: { id: id }, returning: true }
        );
        response.status(200).send({ msg: "Subcategory updated successfully!" });
    }
);

router.delete(
    "/subcategories/:id",
    IDmiddleware,
    async (request: Request, response: Response) => {
        const id: number = (request as any).parsedID;
        if (!(await Subcategory.findByPk(id)))
            response.status(404).send({ msg: "Subcategory not found!" });
        await Subcategory.destroy({ where: { id: id } });
        response.status(200).send({ msg: "Subcategory deleted successfully!" });
    }
);

export default router;
