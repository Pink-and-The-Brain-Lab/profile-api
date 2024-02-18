import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import Profile from "../models/profile.model";
import { ICreateProfile } from "../routes/interfaces/create-profile.interface";

class CreateProfileServiceService {
    public async execute({ email }: ICreateProfile, userId: string): Promise<Profile> {
        try {
            const profileRepository = AppDataSource.getRepository(Profile);
            const newProfile = profileRepository.create();
            newProfile.email = email;
            newProfile.userId = userId;
            await profileRepository.save(newProfile);
            return newProfile;
        } catch (error: any) {
            throw new AppError(error.message, error.status);
        }
    }
}

export default CreateProfileServiceService;