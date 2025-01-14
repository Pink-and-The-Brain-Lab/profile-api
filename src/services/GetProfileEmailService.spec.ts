import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import GetProfileEmailService from "./GetProfileEmailService";

jest.mock("../data-source");
jest.mock('millez-lib-api');

describe("GetProfileEmailService", () => {
    let mockProfileRepository: any;

    beforeEach(() => {
        mockProfileRepository = {
            findBy: jest.fn(),
        };

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockProfileRepository);
    });

    it("should return the email of the first profile if it exists", async () => {
        const service = new GetProfileEmailService();
        const profileId = "profile123";
        const mockProfiles = [
            { id: profileId, email: "test@example.com" },
        ];
        mockProfileRepository.findBy.mockResolvedValue(mockProfiles);
        const result = await service.execute(profileId);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ id: profileId });
        expect(result).toBe(mockProfiles[0].email);
    });

    it("should throw an AppError if no profiles are found", async () => {
        const service = new GetProfileEmailService();
        const profileId = "profile123";
        mockProfileRepository.findBy.mockResolvedValue([]);
        await expect(service.execute(profileId)).rejects.toBeInstanceOf(AppError);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ id: profileId });
    });

    it("should throw an AppError if the repository throws an unexpected error", async () => {
        const service = new GetProfileEmailService();
        const profileId = "profile123";
        mockProfileRepository.findBy.mockRejectedValue(new Error("Unexpected error"));
        await expect(service.execute(profileId)).rejects.toBeInstanceOf(AppError);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ id: profileId });
    });
});
