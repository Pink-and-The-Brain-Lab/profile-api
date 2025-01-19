import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import EmitProfileUpdateService from "./EmitProfileUpdateService";
import UpdateProfileService from "./UpdateProfileService";

jest.mock('millez-lib-api');
jest.mock("../data-source", () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

jest.mock("./EmitProfileUpdateService");

describe("UpdateProfileService", () => {
    let mockProfileRepository: any;
    let mockEmitProfileUpdateService: any;

    beforeEach(() => {
        mockProfileRepository = {
            findOneBy: jest.fn(),
            save: jest.fn(),
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockProfileRepository);
        mockEmitProfileUpdateService = {
            execute: jest.fn(),
        };
        (EmitProfileUpdateService as jest.Mock).mockImplementation(() => mockEmitProfileUpdateService);
    });

    it("should update the profile and return the updated profile", async () => {
        const updateProfileService = new UpdateProfileService();
        const data: any = {
            id: "profile123",
            image: "image_url",
            chosenName: "John",
            profileName: "John's Profile",
            profileVisibility: "public",
            profileTheme: "dark",
            logoutTime: 30,
            dateFormat: "MM/DD/YYYY",
            validated: true,
            language: "en",
        };
        const existingProfile: any = {
            id: "profile123",
            userId: "user123",
            color: "red",
            image: "old_image_url",
            chosenName: "Old Name",
            profileName: "Old Profile",
            profileVisibility: "private",
            profileTheme: "light",
            logoutTime: 15,
            dateFormat: "DD/MM/YYYY",
            validated: false,
            language: "fr",
        };
        mockProfileRepository.findOneBy.mockResolvedValue(existingProfile);
        mockProfileRepository.save.mockResolvedValue({ ...existingProfile, ...data });
        mockEmitProfileUpdateService.execute.mockResolvedValue(undefined);
        const result = await updateProfileService.execute(data);
        expect(mockProfileRepository.findOneBy).toHaveBeenCalledWith({ id: data.id });
        expect(mockProfileRepository.save).toHaveBeenCalledWith({
            ...existingProfile,
            ...data,
        });
        expect(result).toEqual({ ...existingProfile, ...data });
    });

    it("should throw an error if the profile is not found", async () => {
        const updateProfileService = new UpdateProfileService();
        const data = { id: "profile123", userId: "user123" };
        mockProfileRepository.findOneBy.mockResolvedValue(null);
        await expect(updateProfileService.execute(data)).rejects.toBeInstanceOf(AppError);
    });

    it("should throw an error if EmitProfileUpdateService fails", async () => {
        const updateProfileService = new UpdateProfileService();
        const data = {
            id: "profile123",
            userId: "user123",
            color: "blue",
        };
        const existingProfile = {
            id: "profile123",
            color: "red",
        };
        mockProfileRepository.findOneBy.mockResolvedValue(existingProfile);
        mockEmitProfileUpdateService.execute.mockRejectedValue(new AppError("Emit failed", 500));
        await expect(updateProfileService.execute(data)).rejects.toBeInstanceOf(AppError);
    });
});
