import { NextFunction, Request, Response, Router } from "express";
import { IPhoneNumberDiponibility } from "./interfaces/phone-number-disponibility.inteface";
import CheckPhoneNumberDisponibility from "../services/CheckPhoneNumberDisponibility";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import AppError from "../constants/AppError";

const checkPhoneNumberDisponibilityRouter = Router();

checkPhoneNumberDisponibilityRouter.post('/', async (request: Request<IPhoneNumberDiponibility>, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        const data = {
            ...request.body,
            userId: userTokenData?.sub,
        };
        const isAvailable = await new CheckPhoneNumberDisponibility().execute(data);
        console.log(isAvailable)
        if (!isAvailable) throw new AppError('API_ERRORS.CELLPHONE_NUMBER_UNAVAILABLE', 404);
        return response.json({ isAvailable });
    } catch (error) {
        next(error);
    }
});

export default checkPhoneNumberDisponibilityRouter;