import { NextFunction, Request, Response, Router } from "express";
import CreateProfileService from "../services/CreateProfileService"
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import SetSelectedProfile from "../services/SetSelectedProfile";
import { VALIDATE_TOKEN } from "../constants/validate-token";
import { AppError } from "millez-lib-api";
const createProfileRouter = Router();

createProfileRouter.post('/', VALIDATE_TOKEN.validate, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        if (!userTokenData || !userTokenData.sub) throw new AppError('USER_NOT_FOUND', 404);
        const userId = userTokenData.sub;
        const service = await new CreateProfileService().execute(request.body, userId);
        await new SetSelectedProfile().execute(service.id, userId);
        return response.json({ profileId: service.id });    
    } catch (error: any) {
        next(error);
    }
});

export default createProfileRouter;
