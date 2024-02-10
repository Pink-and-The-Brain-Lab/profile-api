import { IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IEmailDiponibility } from "../routes/interfaces/email-disponibility.inteface";

class CheckEmailDisponibility {
    public async execute(data: IEmailDiponibility) {
        const connection = new RabbitMqManageConnection('amqp://localhost');
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        const isEmailAvailable = await rabbitMqService.sendDataToAPI<IEmailDiponibility, IValidationTokenData>(data, RabbitMqQueues.CHECK_EMAIL_DISPONIBILITY, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
        return isEmailAvailable;
    }
}

export default CheckEmailDisponibility;