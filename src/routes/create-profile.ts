import { NextFunction, Request, Response, Router } from "express";
import CreateProfileService from "../services/CreateProfileService"
import multer from 'multer';
import { IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import { GET_TOKEN_DATA } from "../constants/get-token-data";
import { uploadConfig } from "../utils/upload.config";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IUpdateUserWithSelectedProfile } from "./interfaces/update-user-with-selected-profile.interface";
import { AppError } from "millez-lib-api/dist/errors/AppError";
const upload = multer(uploadConfig);
const createProfileRouter = Router();

createProfileRouter.post('/', upload.single('image'), async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userTokenData = await GET_TOKEN_DATA.get(request);
        // const imageUrl = request.file?.filename || '';
        const service = await new CreateProfileService().execute(request.body);
        const connection = new RabbitMqManageConnection('amqp://localhost');
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        const data: IUpdateUserWithSelectedProfile = { userId: userTokenData?.sub || '', profileId: service.id };
        const updateUserApiResponse = await rabbitMqService.sendDataToAPI<IUpdateUserWithSelectedProfile, IValidationTokenData>(data, RabbitMqQueues.UPDATE_USER_WITH_SELECTED_PROFILE_ID, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
        if (updateUserApiResponse.statusCode) throw new AppError(updateUserApiResponse.message || '', updateUserApiResponse.statusCode);
        return response.json({ profileId: service.id });    
    } catch (error: any) {
        next(error);
    }
});

export default createProfileRouter;