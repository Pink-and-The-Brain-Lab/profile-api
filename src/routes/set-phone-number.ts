import { NextFunction, Request, Response, Router } from "express";
import { IPhoneNumberDiponibility } from "./interfaces/phone-number-disponibility.inteface";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import UpdateUserWithPhoneNumberService from "../services/UpdateUserWithPhoneNumberService";
import { AppError } from "millez-lib-api";
import { VALIDATE_TOKEN } from "../constants/validate-token";
const setPhoneNumberRouter = Router();

setPhoneNumberRouter.post('/', VALIDATE_TOKEN.validate, async (request: Request<IPhoneNumberDiponibility>, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        if (!userTokenData || !userTokenData.sub) throw new AppError('USER_NOT_FOUND', 404);
        const userId = userTokenData.sub;
        const data = {
            ...request.body,
            userId,
        };
        const service = await new UpdateUserWithPhoneNumberService().execute(data);
        if (service.statusCode) throw new AppError(service.message, service.statusCode);
        return response.json({ updated: true });
    } catch (error: any) {
        next(error);
    }
});

export default setPhoneNumberRouter;