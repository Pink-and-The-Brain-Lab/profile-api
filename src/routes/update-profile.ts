import { NextFunction, Request, Response, Router } from "express";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import UpdateProfileService from "../services/UpdateProfileService";
import multer from 'multer';
import { uploadConfig } from "../utils/upload.config";
import { GenerateNewTokenService } from "../services/GenerateNewTokenService";
import { VALIDATE_TOKEN } from "../constants/validate-token";
import GetProfileEmailService from "../services/GetProfileEmailService";
import { AppError } from "millez-lib-api";
const upload = multer(uploadConfig);
const updateProfileRouter = Router();

updateProfileRouter.post('/', VALIDATE_TOKEN.validate, upload.single('image'), async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        if (!userTokenData || !userTokenData.sub) throw new AppError('USER_NOT_FOUND', 404);
        const imageUrl = request.file?.filename || '';
        const data = {
            ...request.body,
            image: imageUrl,
            userId: userTokenData,
        };
        if (!data.email) {
            const profileEmail = await new GetProfileEmailService().execute(data.id);
            data.email = profileEmail;
        }
        if (data.phoneNumber) {
            const tokenApiResponse = await new GenerateNewTokenService().execute(data.email);
            if (tokenApiResponse.statusCode)
                throw new AppError(tokenApiResponse.message, tokenApiResponse.statusCode);
        }
        
        const profile = await new UpdateProfileService().execute(data);
        return response.json({ profile });
    } catch (error) {
        next(error);
    }
});

export default updateProfileRouter;