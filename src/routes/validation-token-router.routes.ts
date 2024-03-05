import { NextFunction, Request, Response, Router } from "express";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { AppError, IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import { IValidateToken } from "./interfaces/validate-token.interface";
import { VALIDATE_TOKEN } from "../constants/validate-token";
const validationTokenRouter = Router();

validationTokenRouter.post('/', VALIDATE_TOKEN.validate, async (request: Request<IValidateToken>, response: Response, next: NextFunction) => {
    try {
        const { token } = request.body;
        const connection = new RabbitMqManageConnection('amqp://localhost');
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        const tokenApiResponse = await rabbitMqService.sendDataToAPI<string, IValidationTokenData>(token, RabbitMqQueues.VALIDATE_TOKEN, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
        if (tokenApiResponse.statusCode) throw new AppError(tokenApiResponse.message || '', tokenApiResponse.statusCode);
        return response.json({ validated: true });
    } catch (error) {
        next(error)
    }
});

export default validationTokenRouter;