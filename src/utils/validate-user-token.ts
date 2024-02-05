import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { RabbitMqMessagesProducerService } from "../services/RabbitMqMessagesProducerService";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IValidationTokenData } from "../services/interfaces/validation-token-data.interface";

const validateUserToken = async (request: Request<any>, response?: Response, next?: NextFunction): Promise<IValidationTokenData> => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) throw new AppError('API_ERRORS.NOT_ALLOWED', 401);
    const rabbitMqService = new RabbitMqMessagesProducerService();
    const userValidation = await rabbitMqService.sendDataToAPI<string>(
        token,
        RabbitMqQueues.VALIDATE_USER_SESSION
    );
    if (next) next();
    return userValidation;

};

export default validateUserToken;
