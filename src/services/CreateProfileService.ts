import { AppDataSource } from "../data-source";
import { RabbitMqMessagesProducerService } from "./RabbitMqMessagesProducerService";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IProfile } from "../routes/interfaces/proifle.inteface";
import Profile from "../models/profile.model";

class CreateProfileService {
    public async execute(userProfile: IProfile) {
        const profileRepository = AppDataSource.getRepository(Profile);
        const existingProfile = await profileRepository.findOneBy({ id: userProfile.id });
        const profile = !!existingProfile ? { ...userProfile } : profileRepository.create({ ...userProfile });
        await profileRepository.save(profile);
        const rabbitMqService = new RabbitMqMessagesProducerService();
        const updateUserApiResponse = await rabbitMqService.sendDataToAPI<string>(
            profile.id,
            RabbitMqQueues.UPDATE_USER_WITH_PROFILE_DATA
        );

        return updateUserApiResponse;
    }
}

export default CreateProfileService;