import { NextFunction, Request, Response, Router } from "express";
import AppError from "../errors/AppError";
import validateUserToken from "../utils/validate-user-token";
import { IPhoneNumberDiponibility } from "./interfaces/phone-number-disponibility.inteface";
import CheckPhoneNumberDisponibility from "../services/CheckPhoneNumberDisponibility";

const checkPhoneNumberDisponibilityRouter = Router();

checkPhoneNumberDisponibilityRouter.post('/', async (request: Request<IPhoneNumberDiponibility>, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await validateUserToken(request);
        const data = {
            ...request.body,
            userId: userTokenData.sub,
        };
        const isAvailable = await new CheckPhoneNumberDisponibility().execute(data);
        if (!isAvailable)  throw new AppError('API_ERRORS.CELLPHONE_NUMBER_UNAVAILABLE')
        return response.json({ isAvailable });
    } catch (error) {
        next(error);
    }
});

export default checkPhoneNumberDisponibilityRouter;