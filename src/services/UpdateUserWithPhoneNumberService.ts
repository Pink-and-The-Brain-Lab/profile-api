import { IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IPhoneNumberDiponibility } from "../routes/interfaces/phone-number-disponibility.inteface";

class UpdateUserWithPhoneNumberService {
    public async execute(data: IPhoneNumberDiponibility) {
        const connection = new RabbitMqManageConnection('amqp://localhost');
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        return await rabbitMqService.sendDataToAPI<IPhoneNumberDiponibility, IValidationTokenData>(data, RabbitMqQueues.UPDATE_USER_WITH_PHONE_NUMBER, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
    }
}

export default UpdateUserWithPhoneNumberService;