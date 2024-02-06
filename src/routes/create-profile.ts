import { NextFunction, Request, Response, Router } from "express";
import { IProfile } from "./interfaces/proifle.inteface";
import AppError from "../errors/AppError";
import CreateProfileService from "../services/CreateProfileService";
import validateUserToken from "../utils/validate-user-token";

const createProfileRouter = Router();

createProfileRouter.post('/', async (request: Request<IProfile>, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await validateUserToken(request, response);
        const data = {
            ...request.body,
            userId: userTokenData.sub
        };
        const service = await new CreateProfileService().execute(data);
        if (service.statusCode) throw new AppError(service.message || '', service.statusCode);
        return response.json(data.id ? {updated: true } : { created: true });    
    } catch (error) {
        next(error);
    }
});

export default createProfileRouter;