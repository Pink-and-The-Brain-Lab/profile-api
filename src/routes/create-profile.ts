import { NextFunction, Request, Response, Router } from "express";
import CreateProfileServiceService from "../services/CreateProfileServiceService"
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import SetSelectedProfile from "../services/SetSelectedProfile";
import { VALIDATE_TOKEN } from "../constants/validate-token";
const createProfileRouter = Router();

createProfileRouter.post('/', VALIDATE_TOKEN.validate, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        const userId = userTokenData?.sub || '';
        const service = await new CreateProfileServiceService().execute(request.body, userId);
        await new SetSelectedProfile().execute(service.id, userId);
        return response.json({ profileId: service.id });    
    } catch (error: any) {
        next(error);
    }
});

export default createProfileRouter;