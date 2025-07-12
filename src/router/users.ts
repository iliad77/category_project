import { Router, Request, Response } from "express";
const router = Router();
import { User } from "../models/index";
import { IDmiddleware } from "../middleware/IDmiddlesware";
import { AuthMiddleware } from "../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Op } from "sequelize";
import { Files } from "../models/files";
dotenv.config();

router.get(
    "/user",
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { hide, limit, page, username, id } = request.query;

            let order: string = "id";
            console.log(typeof username);
            if (username || id) {
                if (username === "ASC" || username === "DESC") {
                    order = "username";
                } else if (id === "ASC" || id === "DESC") {
                    order = "id";
                } else {
                    return response.status(400).json({ msg: "invalid params" });
                }
            }
            const Intlimit = parseInt(limit as any) || 10;
            const Intpage = parseInt(page as any) || 1;
            console.log(page, Intpage);
            const count = await User.count();
            if ((Intpage - 1) * Intlimit > count)
                return response.json({ msg: "page does not exist!" });
            const user = await User.findAll({
                where: { status: { [Op.ne]: -1 } },
                attributes: [`username`, "id", "email", "profile_pic"],
                limit: Intlimit,
                order: [[`${order}`, `${username || id || "ASC"}`]],
                offset: (Intpage - 1) * Intlimit,
            });
            if (!hide || hide === "0") {
                response.status(200).send(user);
            } else if (hide === "1") {
                response.status(200).send({ msg: "users are hidden!" });
            }
        } catch (error) {
            return response.status(400).json((error as any).name);
        }
    }
);

router.get(
    "/user/:id",
    IDmiddleware,
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const user = await User.findByPk((request as any).parsedID);
            if (!user)
                return response
                    .status(404)
                    .send({ message: "user was not found" });
            if (user?.status === -1)
                return response
                    .status(404)
                    .json({ msg: "user does not exist" });
            if ((request as any).user?.id !== (request as any).parsedID)
                return response
                    .status(401)
                    .json({ msg: "you dont have access!" });
            response.status(200).send(user);
        } catch (error) {
            return response.status(400).json((error as any).name);
        }
    }
);

router.post(
    "/user",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { username, password, pass_confirm } = request.body;
            if (!username && password && pass_confirm)
                return response
                    .status(400)
                    .send({ msg: "all field must not be empty" });
            if (password !== pass_confirm)
                return response
                    .status(400)
                    .send({ msg: "passwords must be the same!" });
            const users = await User.findAll({ where: { username: username } });
            if ((users as Array<any>).length !== 0)
                return response
                    .status(200)
                    .send({ msg: "username already exist!" });
            else {
                const hash_pass = await bcrypt.hash(password, 5);
                const user = await User.create(
                    { username, password: hash_pass },
                    { returning: true }
                );
                return response.status(200).send({
                    msg: `user ${user.username} created successfully!`,
                });
            }
        } catch (error) {
            return response.status(400).json((error as any).name);
        }
    }
);

router.post(
    "/login",
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { username, password } = request.body;
            const user = await User.findOne({ where: { username: username } });
            if (!username || !password)
                return response
                    .status(400)
                    .json({ msg: "username or password is required!" });
            if (!user)
                return response
                    .status(404)
                    .json({ msg: "username does not exist!" });
            if (user) {
                if (!(await bcrypt.compare(password, user.password)))
                    return response
                        .status(401)
                        .json({ msg: "password is incorrect!" });
                const payload = {
                    id: user.id,
                    username: user.username,
                };
                const token = jwt.sign(payload, process.env.SECRET as string, {
                    expiresIn: "20m",
                });
                return response
                    .status(200)
                    .json({ msg: "you logged in successfully!", token });
            }
        } catch (error) {
            return response.status(400).json((error as any).name);
        }
    }
);

router.patch(
    "/user/:id",
    IDmiddleware,
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const { username, email, password, profile_pic } = request.body;
            const updatedfield: Partial<{
                username: string;
                email: string;
                password: string;
                profile_pic: string;
            }> = {};
            const id = (request as any).parsedID;
            if (!username && !email && !password && !profile_pic) {
                return response
                    .status(400)
                    .send({ msg: "At least one field must be provided!" });
            }
            if ((request as any).user?.id !== (request as any).parsedID)
                return response
                    .status(401)
                    .json({ msg: "you dont have access!" });
            const DupUser = await User.findOne({
                where: {
                    username: username,
                    id: { [Op.ne]: id },
                },
            });
            if (DupUser)
                return response
                    .status(400)
                    .json({ msg: "this username is already in use!" });
            if (username) updatedfield.username = username;
            if (email) updatedfield.email = email;
            if (profile_pic) {
                const file = await Files.findOne({
                    where: { id: profile_pic },
                });
                const fileID = (file as any).id;
                updatedfield.profile_pic = fileID;
            }
            if (password != undefined) {
                const hash_pass = await bcrypt.hash(password, 5);
                updatedfield.password = hash_pass;
            }
            const [count, user] = await User.update(updatedfield, {
                where: { id: id },
                returning: true,
            });

            if (count === 0)
                return response.status(404).json({ msg: "user not found!" });

            return response
                .status(200)
                .send({ msg: "user updated succesfully", user });
        } catch (error) {
            return response.status(400).json((error as any).name);
        }
    }
);

router.delete(
    "/user/:id",
    IDmiddleware,
    AuthMiddleware,
    async (request: Request, response: Response): Promise<any> => {
        try {
            const user = await User.findByPk((request as any).parsedID);
            if (!user)
                return response
                    .status(404)
                    .json({ msg: "user does not exist" });
            await User.update(
                { status: -1 },
                { where: { id: (request as any).parsedID } }
            );
            return response
                .status(200)
                .json({ msg: "user deleted successfully!" });
        } catch (error) {
            return response.status(400).json(error);
        }
    }
);

export default router;
