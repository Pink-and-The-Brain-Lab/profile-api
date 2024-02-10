import { AppDataSource } from "../data-source";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IProfile } from "../routes/interfaces/proifle.inteface";
import Profile from "../models/profile.model";
import { IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";

class CreateProfileService {
    public async execute(userProfile: IProfile) {
        const profileRepository = AppDataSource.getRepository(Profile);
        const existingProfile = await profileRepository.findOneBy({ id: userProfile.id });
        const profile = !!existingProfile ? { ...userProfile } : profileRepository.create({ ...userProfile });
        await profileRepository.save(profile);
        const connection = new RabbitMqManageConnection('amqp://localhost');
        const rabbitMqService = new RabbitMqMessagesProducerService(connection);
        const updateUserApiResponse = await rabbitMqService.sendDataToAPI<string, IValidationTokenData>(profile.id, RabbitMqQueues.UPDATE_USER_WITH_PROFILE_DATA, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
        return updateUserApiResponse;
    }
}

export default CreateProfileService;