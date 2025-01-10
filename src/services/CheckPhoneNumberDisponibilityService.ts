import { IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IPhoneNumberDiponibility } from "../routes/interfaces/phone-number-disponibility.inteface";
import { RABBITMQ_HOST_URL } from "../constants/rabbitmq-host-url";

class CheckPhoneNumberDisponibilityService {
    public async execute(data: IPhoneNumberDiponibility) {
        const connection = new RabbitMqManageConnection(RABBITMQ_HOST_URL);
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        const isPhoneNumberAvailable = await rabbitMqService.sendDataToAPI<IPhoneNumberDiponibility, IValidationTokenData>(data, RabbitMqQueues.CHECK_PHONE_NUMBER_DISPONIBILITY, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
        return isPhoneNumberAvailable;
    }
}

export default CheckPhoneNumberDisponibilityService;
