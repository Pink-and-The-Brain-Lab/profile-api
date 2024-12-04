import { NextFunction, Request, Response, Router } from "express";
import { IEmailDiponibility } from "./interfaces/email-disponibility.inteface";
import CheckEmailDisponibilityService from "../services/CheckEmailDisponibilityService";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import { AppError } from "millez-lib-api/dist/errors/AppError";
import { VALIDATE_TOKEN } from "../constants/validate-token";
const checkEmailDisponibilityRouter = Router();

checkEmailDisponibilityRouter.post('/', VALIDATE_TOKEN.validate, async (request: Request<IEmailDiponibility>, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        if (!userTokenData || !userTokenData.sub) throw new AppError('USER_NOT_FOUND', 404);
        const userId = userTokenData.sub;
        const data = {
            ...request.body,
            userId,
        };
        const isAvailable = await new CheckEmailDisponibilityService().execute(data);
        if (!isAvailable)  throw new AppError('API_ERRORS.EMAIL_UNAVAILABLE')
        return response.json({ isAvailable });
    } catch (error) {
        next(error);
    }
});

export default checkEmailDisponibilityRouter;
