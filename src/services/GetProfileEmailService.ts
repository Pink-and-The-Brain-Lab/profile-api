import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import Profile from "../models/profile.model";

class GetProfileEmailService {
    public async execute(id: string) {
        try {
            const profileRepository = AppDataSource.getRepository(Profile);
            const profiles = await profileRepository.findBy({ id });
            return profiles[0].email;
        } catch (error: any) {
            throw new AppError(error.message, error.status);
        }
    }
}

export default GetProfileEmailService;
