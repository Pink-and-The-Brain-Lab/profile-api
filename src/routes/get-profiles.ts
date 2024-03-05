import { NextFunction, Request, Response, Router } from "express";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import GetProfilesService from "../services/GetProfilesService";
import { VALIDATE_TOKEN } from "../constants/validate-token";
const getProfilesRouter = Router();

getProfilesRouter.get('/', VALIDATE_TOKEN.validate, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        const userId = userTokenData?.sub || '';
        const profiles = await new GetProfilesService().execute(userId);
        return response.json({ profiles });
    } catch (error: any) {
        next(error);
    }
});

export default getProfilesRouter;