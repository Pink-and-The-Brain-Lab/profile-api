import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import Profile from "../models/profile.model";
import { IValidationTokenData, RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";
import { IUpdateUserWithSelectedProfile } from "../routes/interfaces/update-user-with-selected-profile.interface";
import EmitProfileUpdateService from "./EmitProfileUpdateService";
import { RABBITMQ_HOST_URL } from "../constants/rabbitmq-host-url";

class SetSelectedProfileService {
    public async execute(profileId: string, userId: string): Promise<boolean> {
        try {
            const profileRepository = AppDataSource.getRepository(Profile);
            const profiles = await profileRepository.findBy({ userId });
            if (!profiles || !profiles.length) throw new AppError('API_ERRORS.PROFILE_NOT_FOUND', 404);
            profiles.map(profile => {
                if (profile.id === profileId) profile.selected = true;
                else profile.selected = false;
                return profile;
            });
            await profileRepository.save(profiles);
            await new EmitProfileUpdateService().execute(userId);
            const connection = new RabbitMqManageConnection(RABBITMQ_HOST_URL);
            const rabbitMqService = new RabbitMqMessagesProducerService(connection);
            const data: IUpdateUserWithSelectedProfile = { userId, profileId };
            const updateUserApiResponse = await rabbitMqService.sendDataToAPI<IUpdateUserWithSelectedProfile, IValidationTokenData>(data, RabbitMqQueues.UPDATE_USER_WITH_SELECTED_PROFILE_ID, RabbitMqQueues.PROFILE_RESPONSE_QUEUE);
            if (updateUserApiResponse.statusCode) throw new AppError(updateUserApiResponse.message, updateUserApiResponse.statusCode);
            return true;
        } catch (error: any) {
            throw new AppError(error.message, error.status);
        }
    }
}

export default SetSelectedProfileService;
