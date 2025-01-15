import { AppError } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import GetProfilesService from "./GetProfilesService";
import { orderDataBy } from "../utils/order-data-by";

jest.mock('millez-lib-api');
jest.mock("../data-source");
jest.mock("../utils/order-data-by");

describe("GetProfilesService", () => {
    let mockProfileRepository: any;

    beforeEach(() => {
        mockProfileRepository = {
            findBy: jest.fn(),
        };

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockProfileRepository);
    });

    it("should return reordered profiles if profiles exist", async () => {
        const service = new GetProfilesService();
        const userId = "user123";
        const mockProfiles = [
            { id: "1", userId, createdat: 2 },
            { id: "2", userId, createdat: 1 },
        ];
        const reorderedProfiles = [
            { id: "2", userId, createdat: 1 },
            { id: "1", userId, createdat: 2 },
        ];

        mockProfileRepository.findBy.mockResolvedValue(mockProfiles);
        (orderDataBy as jest.Mock).mockReturnValue(reorderedProfiles);
        const result = await service.execute(userId);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ userId });
        expect(orderDataBy).toHaveBeenCalledWith(mockProfiles, "createdat");
        expect(result).toEqual(reorderedProfiles);
    });

    it("should return an empty array if no profiles are found", async () => {
        const service = new GetProfilesService();
        const userId = "user123";
        mockProfileRepository.findBy.mockResolvedValue([]);
        (orderDataBy as jest.Mock).mockReturnValue([]);
        const result = await service.execute(userId);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ userId });
        expect(orderDataBy).toHaveBeenCalledWith([], "createdat");
        expect(result).toEqual([]);
    });

    it("should throw an AppError if the repository throws an unexpected error", async () => {
        const service = new GetProfilesService();
        const userId = "user123";
        mockProfileRepository.findBy.mockRejectedValue(new Error("Unexpected error"));
        await expect(service.execute(userId)).rejects.toBeInstanceOf(AppError);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ userId });
    });
});
