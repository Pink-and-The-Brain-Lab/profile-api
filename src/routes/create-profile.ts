import { NextFunction, Request, Response, Router } from "express";
import AppError from "../errors/AppError";
import CreateProfileService from "../services/CreateProfileService";
import validateUserToken from "../utils/validate-user-token";
import multer from 'multer';
import uploadConfig from "../utils/upload-config";
const upload = multer(uploadConfig);

const createProfileRouter = Router();

createProfileRouter.post('/', upload.single('image'), async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await validateUserToken(request, response);
        // console.log(request.body);
        const imageUrl = request.file?.filename || '';
        const data = {
            ...request.body,
            userId: userTokenData.sub,
            image: imageUrl,
        };
        const service = await new CreateProfileService().execute(data);
        if (service.statusCode) throw new AppError(service.message || '', service.statusCode);
        return response.json(data.id ? {updated: true } : { created: true });    
    } catch (error) {
        next(error);
    }
});

export default createProfileRouter;