import { NextFunction, Request, Response } from "express";

export const IDmiddleware = function (
    request: Request,
    response: Response,
    next: NextFunction
) {
    const id: number = parseInt(request.params.id);
    if (isNaN(id)) {
        response.status(400).send({ msg: "id is invalid!" });
    }
    (request as any).parsedID = id;
    next();
};
