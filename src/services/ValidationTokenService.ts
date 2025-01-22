import { IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { RABBITMQ_HOST_URL } from "../constants/rabbitmq-host-url";

class ValidationTokenService {
    public async execute(token: string) {
        const connection = new RabbitMqManageConnection(RABBITMQ_HOST_URL);
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        return await rabbitMqService.sendDataToAPI<string, IValidationTokenData>(token, RabbitMqQueues.VALIDATE_TOKEN, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
    }
}

export default ValidationTokenService;
