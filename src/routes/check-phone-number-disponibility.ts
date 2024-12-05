import { NextFunction, Request, Response, Router } from "express";
import { IPhoneNumberDiponibility } from "./interfaces/phone-number-disponibility.inteface";
import CheckPhoneNumberDisponibilityService from "../services/CheckPhoneNumberDisponibilityService";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import { VALIDATE_TOKEN } from "../constants/validate-token";
import { AppError } from "millez-lib-api";
const checkPhoneNumberDisponibilityRouter = Router();

checkPhoneNumberDisponibilityRouter.post('/', VALIDATE_TOKEN.validate, async (request: Request<IPhoneNumberDiponibility>, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        if (!userTokenData || !userTokenData.sub) throw new AppError('USER_NOT_FOUND', 404);
        const userId = userTokenData.sub;
        const data = {
            ...request.body,
            userId,
        };
        const isAvailable = await new CheckPhoneNumberDisponibilityService().execute(data);
        if (!isAvailable) throw new AppError('API_ERRORS.CELLPHONE_NUMBER_UNAVAILABLE');
        return response.json({ isAvailable });
    } catch (error) {
        next(error);
    }
});

export default checkPhoneNumberDisponibilityRouter;
