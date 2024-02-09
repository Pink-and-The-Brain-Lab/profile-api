import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IValidationTokenData } from "../services/interfaces/validation-token-data.interface";
import { RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";

const validateUserToken = async (request: Request<any>, response: Response, next: NextFunction) => {
    try {
        const token = await getTokenData(request);
        if (!token || token.expiredAt) throw new AppError('API_ERRORS.NOT_ALLOWED', 401);
        next();
    } catch (error) {
        next(error);
    }
};

const getTokenData = async (request: Request<any>): Promise<IValidationTokenData | null> => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    const connection = new RabbitMqManageConnection('amqp://localhost');
    const rabbitMqService = new RabbitMqMessagesProducerService(connection);
    const userValidation = await rabbitMqService.sendDataToAPI<string, IValidationTokenData>(token, RabbitMqQueues.VALIDATE_USER_SESSION, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
    return userValidation;
}

export { validateUserToken, getTokenData };
