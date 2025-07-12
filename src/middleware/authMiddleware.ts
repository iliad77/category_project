import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const AuthMiddleware = function (
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const authHeader: any = request.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) response.status(401).send({ msg: "you dont have access!" });

        const decode = jwt.verify(token, process.env.SECRET as string);
        (request as any).user = decode;
        next();
    } catch (error) {
        if ((error as any).name === "TokenExpiredError")
            response.status(401).json({ message: "your login is expired" });
        else response.json(error);
    }
};
