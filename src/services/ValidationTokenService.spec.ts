import { RabbitMqManageConnection, RabbitMqMessagesProducerService } from "millez-lib-api";
import ValidationTokenService from "./ValidationTokenService";
import { RABBITMQ_HOST_URL } from "../constants/rabbitmq-host-url";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";

jest.mock("millez-lib-api", () => ({
    RabbitMqManageConnection: jest.fn(),
    RabbitMqMessagesProducerService: jest.fn(),
}));

describe('ValidationTokenService', () => {
    let mockRabbitMqService: any;

    beforeEach(() => {
        mockRabbitMqService = {
            sendDataToAPI: jest.fn(),
        };
        (RabbitMqMessagesProducerService as jest.Mock).mockImplementation(() => mockRabbitMqService);
    });

    it("should send data to RabbitMQ and return the response", async () => {
        const validationTokenService = new ValidationTokenService();
        const expectedResponse = {
            validated: true
        };
        mockRabbitMqService.sendDataToAPI.mockResolvedValue(expectedResponse);
        const result = await validationTokenService.execute('123456');
        expect(RabbitMqManageConnection).toHaveBeenCalledWith(RABBITMQ_HOST_URL);
        expect(mockRabbitMqService.sendDataToAPI).toHaveBeenCalledWith(
            '123456',
            RabbitMqQueues.VALIDATE_TOKEN,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
        expect(result).toEqual(expectedResponse);
    });

    it("should throw an error if sendDataToAPI fails", async () => {
        const validationTokenService = new ValidationTokenService();
        mockRabbitMqService.sendDataToAPI.mockRejectedValue(new Error("RabbitMQ error"));
        await expect(validationTokenService.execute('123456')).rejects.toThrow("RabbitMQ error");
        expect(RabbitMqManageConnection).toHaveBeenCalledWith(RABBITMQ_HOST_URL);
        expect(mockRabbitMqService.sendDataToAPI).toHaveBeenCalledWith(
            '123456',
            RabbitMqQueues.VALIDATE_TOKEN,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
    });
});