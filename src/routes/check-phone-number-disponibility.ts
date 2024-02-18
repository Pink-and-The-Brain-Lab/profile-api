import { NextFunction, Request, Response, Router } from "express";
import { IPhoneNumberDiponibility } from "./interfaces/phone-number-disponibility.inteface";
import CheckPhoneNumberDisponibilityService from "../services/CheckPhoneNumberDisponibilityService";
import { GET_TOKEN_DATA } from "../constants/get-token-data";

const checkPhoneNumberDisponibilityRouter = Router();

checkPhoneNumberDisponibilityRouter.post('/', async (request: Request<IPhoneNumberDiponibility>, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        const data = {
            ...request.body,
            userId: userTokenData?.sub,
        };
        const isAvailable = await new CheckPhoneNumberDisponibilityService().execute(data);
        return response.json({ isAvailable });
    } catch (error) {
        next(error);
    }
});

export default checkPhoneNumberDisponibilityRouter;