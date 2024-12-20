import { NextFunction, Request, Response, Router } from "express";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import GetProfilesService from "../services/GetProfilesService";
import { VALIDATE_TOKEN } from "../constants/validate-token";
import { AppError } from "millez-lib-api";
const getProfilesRouter = Router();

getProfilesRouter.get('/', VALIDATE_TOKEN.validate, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        if (!userTokenData || !userTokenData.sub) throw new AppError('USER_NOT_FOUND', 404);
        const userId = userTokenData.sub;
        const profiles = await new GetProfilesService().execute(userId);
        return response.json({ profiles });
    } catch (error: any) {
        next(error);
    }
});

export default getProfilesRouter;
