import { NextFunction, Request, Response, Router } from "express";
import { IPhoneNumberDiponibility } from "./interfaces/phone-number-disponibility.inteface";
import { AppError } from "millez-lib-api";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import UpdateUserWithPhoneNumber from "../services/UpdateUserWithPhoneNumber.service";

const setPhoneNumberRouter = Router();

setPhoneNumberRouter.post('/', async (request: Request<IPhoneNumberDiponibility>, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        const data = {
            ...request.body,
            userId: userTokenData?.sub,
        };
        const service = await new UpdateUserWithPhoneNumber().execute(data);
        console.log(data, service)
        if (service.statusCode) throw new AppError(service.message || '', service.statusCode);
        return response.json({ updated: true });
    } catch (error) {
        next(error);
    }
});

export default setPhoneNumberRouter;