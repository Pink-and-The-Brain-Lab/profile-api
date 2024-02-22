import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import Profile from "../models/profile.model";

class SetSelectedProfile {
    public async execute(profileId: string, userId: string): Promise<boolean> {
        try {
            const profileRepository = AppDataSource.getRepository(Profile);
            const profiles = await profileRepository.findBy({ userId });
            if (!profiles || !profiles.length) throw new AppError('API_ERRORS.PROFILE_NOT_FOUND', 404);
            const profilesUpdated = profiles.filter(profile => profile.id !== profileId);
            profilesUpdated.map(profile => profile.selected = false);
            profileRepository.save(profilesUpdated);
            return true;
        } catch (error: any) {
            throw new AppError(error.message, error.status);
        }
    }
}

export default SetSelectedProfile;