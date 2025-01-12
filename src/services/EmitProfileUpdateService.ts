import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import Profile from "../models/profile.model";
import { socketConnection } from "../web-socket";
import { orderDataBy } from "../utils/order-data-by";

class EmitProfileUpdateService {
    public async execute(userId: string): Promise<void> {
        try {
            const profileRepository = AppDataSource.getRepository(Profile);
            const profiles = await profileRepository.findBy({ userId });
            if (!profiles || !profiles.length) return;
            const reorderedProfiles = orderDataBy(profiles, 'createdat');
            socketConnection.emit('profiles', reorderedProfiles);
        } catch (error: any) {
            throw new AppError(error.message, error.status);
        }
    }
}

export default EmitProfileUpdateService;
