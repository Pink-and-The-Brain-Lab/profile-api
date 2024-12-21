import { NextFunction, Request, Response, Router } from "express";
import { AppError } from "millez-lib-api";
import { IValidateToken } from "./interfaces/validate-token.interface";
import { VALIDATE_TOKEN } from "../constants/validate-token";
import ValidationTokenService from "../services/ValidationTokenService";
const validationTokenRouter = Router();

validationTokenRouter.post('/', VALIDATE_TOKEN.validate, async (request: Request<IValidateToken>, response: Response, next: NextFunction) => {
    try {
        const { token } = request.body;
        const service = await new ValidationTokenService().execute(token);
        if (service.statusCode) throw new AppError(service.message, service.statusCode);
        return response.json({ validated: true });
    } catch (error) {
        next(error)
    }
});

export default validationTokenRouter;
