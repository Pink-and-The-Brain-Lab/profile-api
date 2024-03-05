import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import Profile from "../models/profile.model";

class GetProfilesService {
    public async execute(userId: string) {
        try {
            const profileRepository = AppDataSource.getRepository(Profile);
            return await profileRepository.findBy({ userId });
        } catch (error: any) {
            throw new AppError(error.message, error.status);
        }
    }
}

export default GetProfilesService;