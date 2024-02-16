import { IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IPhoneNumberDiponibility } from "../routes/interfaces/phone-number-disponibility.inteface";
import { AppError } from "millez-lib-api/dist/errors/AppError";

class CheckPhoneNumberDisponibility {
    public async execute(data: IPhoneNumberDiponibility) {
        const connection = new RabbitMqManageConnection('amqp://localhost');
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        const isPhoneNumberAvailable = await rabbitMqService.sendDataToAPI<IPhoneNumberDiponibility, IValidationTokenData>(data, RabbitMqQueues.CHECK_PHONE_NUMBER_DISPONIBILITY, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
        if (!isPhoneNumberAvailable) throw new AppError('API_ERRORS.CELLPHONE_NUMBER_UNAVAILABLE', 404);
        return isPhoneNumberAvailable;
    }
}

export default CheckPhoneNumberDisponibility;