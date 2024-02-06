import { RabbitMqMessagesProducerService } from "./RabbitMqMessagesProducerService";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IEmailDiponibility } from "../routes/interfaces/email-disponibility.inteface";

class CheckEmailDisponibility {
    public async execute(data: IEmailDiponibility) {
        const rabbitMqService = new RabbitMqMessagesProducerService();
        const isEmailAvailable = await rabbitMqService.sendDataToAPI<IEmailDiponibility>(
            data,
            RabbitMqQueues.CHECK_EMAIL_DISPONIBILITY
        );

        return isEmailAvailable;
    }
}

export default CheckEmailDisponibility;