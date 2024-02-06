import { RabbitMqMessagesProducerService } from "./RabbitMqMessagesProducerService";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IPhoneNumberDiponibility } from "../routes/interfaces/phone-number-disponibility.inteface";

class CheckPhoneNumberDisponibility {
    public async execute(data: IPhoneNumberDiponibility) {
        const rabbitMqService = new RabbitMqMessagesProducerService();
        const isPhoneNumberAvailable = await rabbitMqService.sendDataToAPI<IPhoneNumberDiponibility>(
            data,
            RabbitMqQueues.CHECK_PHONE_NUMBER_DISPONIBILITY
        );

        return isPhoneNumberAvailable;
    }
}

export default CheckPhoneNumberDisponibility;