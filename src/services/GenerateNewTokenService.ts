import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { AppError, IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import { validateEmail } from "../utils/validate-email";

export class GenerateNewTokenService {
    public async execute(email: string) {
        validateEmail(email);
        const connection = new RabbitMqManageConnection('amqp://localhost');
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        const tokenApiResponse = await rabbitMqService.sendDataToAPI<string, IValidationTokenData>(email, RabbitMqQueues.CREATE_TOKEN, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
        if (tokenApiResponse.statusCode) throw new AppError(tokenApiResponse.message || '', tokenApiResponse.statusCode);
        return true;
    }
}