import { IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IEmailDiponibility } from "../routes/interfaces/email-disponibility.inteface";
import { RABBITMQ_HOST_URL } from "../constants/rabbitmq-host-url";

class CheckEmailDisponibilityService {
    public async execute(data: IEmailDiponibility) {
        const connection = new RabbitMqManageConnection(RABBITMQ_HOST_URL);
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        const isEmailAvailable = await rabbitMqService.sendDataToAPI<IEmailDiponibility, IValidationTokenData>(data, RabbitMqQueues.CHECK_EMAIL_DISPONIBILITY, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
        return isEmailAvailable;
    }
}

export default CheckEmailDisponibilityService;
