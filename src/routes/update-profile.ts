import { NextFunction, Request, Response, Router } from "express";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import UpdateProfileService from "../services/UpdateProfileService";
import multer from 'multer';
import { uploadConfig } from "../utils/upload.config";
import { GenerateNewTokenService } from "../services/GenerateNewTokenService";
import { VALIDATE_TOKEN } from "../constants/validate-token";
import GetProfileEmailService from "../services/GetProfileEmailService";
const upload = multer(uploadConfig);
const updateProfileRouter = Router();

updateProfileRouter.post('/', VALIDATE_TOKEN.validate, upload.single('image'), async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        const imageUrl = request.file?.filename || '';
        const data = {
            ...request.body,
            image: imageUrl,
            userId: userTokenData?.sub,
        };
        if (!data.email) {
            const profileEmail = await new GetProfileEmailService().execute(data.id);
            data.email = profileEmail;
        }
        if (data.phoneNumber) await new GenerateNewTokenService().execute(data.email);
        const profile = await new UpdateProfileService().execute(data);
        return response.json({ profile });
    } catch (error) {
        next(error);
    }
});

export default updateProfileRouter;