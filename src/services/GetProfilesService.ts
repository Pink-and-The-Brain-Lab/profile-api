import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import Profile from "../models/profile.model";
import { orderDataBy } from "../utils/order-data-by";

class GetProfilesService {
    public async execute(userId: string) {
        try {
            const profileRepository = AppDataSource.getRepository(Profile);
            const profiles = await profileRepository.findBy({ userId });
            const reorderedProfiles = orderDataBy(profiles, 'createdat');
            return reorderedProfiles;
        } catch (error: any) {
            throw new AppError(error.message, error.status);
        }
    }
}

export default GetProfilesService;
