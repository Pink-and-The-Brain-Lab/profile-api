import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import Profile from "../models/profile.model";
import { ICreateProfile } from "../routes/interfaces/create-profile.interface";

class CreateProfileService {
    public async execute({ email }: ICreateProfile): Promise<Profile> {
        try {
            const profileRepository = AppDataSource.getRepository(Profile);
            const newProfile = profileRepository.create();
            newProfile.email = email;
            await profileRepository.save(newProfile);
            

            /**
             * improve this, separate concerns, create a route to create a new profile
             * create a new route to update profile
             * create new RabbitMQ message to update user with new profile ID, send UserId and Profile ID
             * create new RabbitMQ message to update use with phone number, send UserId and phone number
             * send RabttiMQ message inside route, keep this serve just to manage profile in database
             * 
             * URGENT - FIX ERROR CLASS TO RETURN A JSON, NOW IS RETURN [OBJECT OBJECT]
             */

            return newProfile;
        } catch (error: any) {
            throw new AppError(error.message, error.status);
        }
    }
}

export default CreateProfileService;