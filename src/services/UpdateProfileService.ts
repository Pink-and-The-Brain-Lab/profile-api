import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import Profile from "../models/profile.model";
import { IProfile } from "../routes/interfaces/proifle.inteface";

class UpdateProfileService {
    public async execute(data: IProfile): Promise<Profile> {
        try {
            const profileRepository = AppDataSource.getRepository(Profile);
            const profile = await profileRepository.findOneBy({ id: data.id });
            if (!profile) throw new AppError('API_ERRORS.PROFILE_NOT_FOUND', 404);
            profile.color = data.color || profile.color;
            profile.image = data.image || profile.image;
            profile.chosenName = data.chosenName || profile.chosenName;
            profile.profileName = data.profileName || profile.profileName;
            profile.profileVisibility = data.profileVisibility || profile.profileVisibility;
            profile.profileTheme = data.profileTheme || profile.profileTheme;
            profile.logoutTime = data.logoutTime || profile.logoutTime;
            profile.dateFormat = data.dateFormat || profile.dateFormat;
            profile.validated = !!data.validated || profile.validated;
            profileRepository.save(profile);
            return profile;
        } catch (error: any) {
            throw new AppError(error.message, error.status);
        }
    }
}

export default UpdateProfileService;