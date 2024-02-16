import { NextFunction, Request, Response, Router } from "express";
import { IPhoneNumberDiponibility } from "./interfaces/phone-number-disponibility.inteface";
import CheckPhoneNumberDisponibility from "../services/CheckPhoneNumberDisponibility";
import { GET_TOKEN_DATA } from "../constants/get-token-data";

const checkPhoneNumberDisponibilityRouter = Router();

checkPhoneNumberDisponibilityRouter.post('/', async (request: Request<IPhoneNumberDiponibility>, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        const data = {
            ...request.body,
            userId: userTokenData?.sub,
        };
        const isAvailable = await new CheckPhoneNumberDisponibility().execute(data);
        return response.json({ isAvailable });
    } catch (error) {
        next(error);
    }
});

export default checkPhoneNumberDisponibilityRouter;