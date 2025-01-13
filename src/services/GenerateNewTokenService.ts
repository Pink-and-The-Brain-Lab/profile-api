import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { AppError, IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService, ValidateEmail } from "millez-lib-api";
import { RABBITMQ_HOST_URL } from "../constants/rabbitmq-host-url";

export class GenerateNewTokenService {
    public async execute(email: string) {
        const validateEmail = new ValidateEmail().validate(email);
        if (!validateEmail) throw new AppError('API_ERRORS.INVALID_EMAIL');
        const connection = new RabbitMqManageConnection(RABBITMQ_HOST_URL);
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        const validationToken = await rabbitMqService.sendDataToAPI<string, IValidationTokenData>(email, RabbitMqQueues.CREATE_TOKEN, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
        return validationToken;
    }
}
