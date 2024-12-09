import { NextFunction, Request, Response, Router } from "express";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import SetSelectedProfile from "../services/SetSelectedProfile";
import { VALIDATE_TOKEN } from "../constants/validate-token";
import { AppError } from "millez-lib-api";
const selectProfileRouter = Router();

selectProfileRouter.post('/', VALIDATE_TOKEN.validate, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        if (!userTokenData || !userTokenData.sub) throw new AppError('USER_NOT_FOUND', 404);
        const userId = userTokenData.sub;
        await new SetSelectedProfile().execute(request.body.profileId, userId);
        return response.json({ selected: true });    
    } catch (error: any) {
        next(error);
    }
});

export default selectProfileRouter;
