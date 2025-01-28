import { AppError, RabbitMqMessagesProducerService } from "millez-lib-api";
import { AppDataSource } from "../data-source";
import EmitProfileUpdateService from "./EmitProfileUpdateService";
import SetSelectedProfileService from "./SetSelectedProfileService";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";

jest.mock("../data-source", () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));
jest.mock("millez-lib-api", () => ({
    RabbitMqManageConnection: jest.fn(),
    RabbitMqMessagesProducerService: jest.fn(),
    AppError: jest.fn().mockImplementation((message, status) => ({ message, status })),
}));
jest.mock("./EmitProfileUpdateService");

describe("SetSelectedProfile", () => {
    let mockProfileRepository: any;
    let mockEmitProfileUpdateService: any;
    let mockRabbitMqService: any;

    beforeEach(() => {
        mockProfileRepository = {
            findBy: jest.fn(),
            save: jest.fn(),
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockProfileRepository);

        mockEmitProfileUpdateService = {
            execute: jest.fn(),
        };
        (EmitProfileUpdateService as jest.Mock).mockImplementation(() => mockEmitProfileUpdateService);

        mockRabbitMqService = {
            sendDataToAPI: jest.fn(),
        };
        (RabbitMqMessagesProducerService as jest.Mock).mockImplementation(() => mockRabbitMqService);
    });

    it("should set the selected profile and return true", async () => {
        const setSelectedProfile = new SetSelectedProfileService();
        const userId = "user123";
        const profileId = "profile123";
        const profiles = [
            { id: "profile123", selected: false },
            { id: "profile456", selected: true },
        ];
        mockProfileRepository.findBy.mockResolvedValue(profiles);
        mockRabbitMqService.sendDataToAPI.mockResolvedValue({ statusCode: null });
        mockEmitProfileUpdateService.execute.mockResolvedValue(undefined);
        const result = await setSelectedProfile.execute(profileId, userId);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ userId });
        expect(profiles[0].selected).toBe(true);
        expect(profiles[1].selected).toBe(false);
        expect(mockProfileRepository.save).toHaveBeenCalledWith(profiles);
        expect(mockEmitProfileUpdateService.execute).toHaveBeenCalledWith(userId);
        expect(mockRabbitMqService.sendDataToAPI).toHaveBeenCalledWith(
            { userId, profileId },
            RabbitMqQueues.UPDATE_USER_WITH_SELECTED_PROFILE_ID,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
        expect(result).toBe(true);
    });

    it("should throw an error if no profiles are found", async () => {
        const setSelectedProfile = new SetSelectedProfileService();
        const userId = "user123";
        const profileId = "profile123";
        mockProfileRepository.findBy.mockResolvedValue([]);
        await expect(setSelectedProfile.execute(profileId, userId)).rejects.toEqual({
            message: "API_ERRORS.PROFILE_NOT_FOUND",
            status: 404,
        });
    });

    it("should throw an error if RabbitMqMessagesProducerService returns an error", async () => {
        const setSelectedProfile = new SetSelectedProfileService();
        const userId = "user123";
        const profileId = "profile123";
        const profiles = [
            { id: "profile123", selected: false },
            { id: "profile456", selected: true },
        ];
        mockProfileRepository.findBy.mockResolvedValue(profiles);
        mockRabbitMqService.sendDataToAPI.mockResolvedValue({
            statusCode: 500,
            message: "Internal Server Error",
        });
        await expect(setSelectedProfile.execute(profileId, userId)).rejects.toEqual({
            message: "Internal Server Error",
            status: 500,
        });
    });

    it("should throw an error if EmitProfileUpdateService fails", async () => {
        const setSelectedProfile = new SetSelectedProfileService();
        const userId = "user123";
        const profileId = "profile123";
        const profiles = [
            { id: "profile123", selected: false },
            { id: "profile456", selected: true },
        ];
        mockProfileRepository.findBy.mockResolvedValue(profiles);
        mockEmitProfileUpdateService.execute.mockRejectedValue(new AppError("Emit failed", 500));
        await expect(setSelectedProfile.execute(profileId, userId)).rejects.toEqual({
            message: "Emit failed",
            status: 500,
        });
    });
});
