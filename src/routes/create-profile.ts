import { NextFunction, Request, Response, Router } from "express";
import CreateProfileService from "../services/CreateProfileService"
import multer from 'multer';
import { AppError } from "millez-lib-api";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import { uploadConfig } from "../utils/upload.config";
const upload = multer(uploadConfig);
const createProfileRouter = Router();

createProfileRouter.post('/', upload.single('image'), async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        const imageUrl = request.file?.filename || '';
        const data = {
            ...request.body,
            userId: userTokenData?.sub,
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