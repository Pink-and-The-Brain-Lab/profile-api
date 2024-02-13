import { NextFunction, Request, Response, Router } from "express";
import { IEmailDiponibility } from "./interfaces/email-disponibility.inteface";
import CheckEmailDisponibility from "../services/CheckEmailDisponibility";
import { AppError } from 'millez-lib-api';
import { GET_TOKEN_DATA } from "../constants/get-token-data";

const checkEmailDisponibilityRouter = Router();

checkEmailDisponibilityRouter.post('/', async (request: Request<IEmailDiponibility>, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        const data = {
            ...request.body,
            userId: userTokenData?.sub,
        };
        const isAvailable = await new CheckEmailDisponibility().execute(data);
        if (!isAvailable)  throw new AppError('API_ERRORS.EMAIL_UNAVAILABLE')
        return response.json({ isAvailable });
    } catch (error) {
        next(error);
    }
});

export default checkEmailDisponibilityRouter;