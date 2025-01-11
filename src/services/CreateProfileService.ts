import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import Profile from "../models/profile.model";
import { ICreateProfile } from "../routes/interfaces/create-profile.interface";

class CreateProfileService {
    public async execute({ email }: ICreateProfile, userId: string): Promise<Profile> {
        try {
            const profileRepository = AppDataSource.getRepository(Profile);
            const profiles = await profileRepository.findBy({ userId });
            if (profiles.length >= 3) throw new AppError('API_ERRORS.YOU_CANNOT_CREATE_MORE_THAN_THREE_PROFILES', 401);
            const newProfile = profileRepository.create();
            newProfile.email = email;
            newProfile.userId = userId;
            newProfile.selected = true;
            newProfile.createdat = new Date().getTime();
            await profileRepository.save(newProfile);
            return newProfile;
        } catch (error: any) {
            throw new AppError(error.message, error.status);
        }
    }
}

export default CreateProfileService;
