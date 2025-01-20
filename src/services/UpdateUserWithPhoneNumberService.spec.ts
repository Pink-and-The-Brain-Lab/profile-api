import { RabbitMqManageConnection, RabbitMqMessagesProducerService, IValidationTokenData } from "millez-lib-api";
import UpdateUserWithPhoneNumberService from "./UpdateUserWithPhoneNumberService";
import { IPhoneNumberDiponibility } from "../routes/interfaces/phone-number-disponibility.inteface";
import { RABBITMQ_HOST_URL } from "../constants/rabbitmq-host-url";
import { RabbitMqQueues } from "../enums/rabbitmq-queues.enum";

jest.mock("millez-lib-api", () => ({
    RabbitMqManageConnection: jest.fn(),
    RabbitMqMessagesProducerService: jest.fn(),
}));

describe("UpdateUserWithPhoneNumberService", () => {
    let mockRabbitMqService: any;

    beforeEach(() => {
        mockRabbitMqService = {
            sendDataToAPI: jest.fn(),
        };
        (RabbitMqMessagesProducerService as jest.Mock).mockImplementation(() => mockRabbitMqService);
    });

    it("should send data to RabbitMQ and return the response", async () => {
        const updateUserWithPhoneNumberService = new UpdateUserWithPhoneNumberService();
        const data: IPhoneNumberDiponibility = {
            phoneNumber: "1234567890",
            userId: "1",
        };
        const expectedResponse: IValidationTokenData = {
            expiredAt: 3600,
        };
        mockRabbitMqService.sendDataToAPI.mockResolvedValue(expectedResponse);
        const result = await updateUserWithPhoneNumberService.execute(data);
        expect(RabbitMqManageConnection).toHaveBeenCalledWith(RABBITMQ_HOST_URL);
        expect(mockRabbitMqService.sendDataToAPI).toHaveBeenCalledWith(
            data,
            RabbitMqQueues.UPDATE_USER_WITH_PHONE_NUMBER,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
        expect(result).toEqual(expectedResponse);
    });

    it("should throw an error if sendDataToAPI fails", async () => {
        const updateUserWithPhoneNumberService = new UpdateUserWithPhoneNumberService();
        const data: IPhoneNumberDiponibility = {
            phoneNumber: "1234567890",
            userId: "1",
        };
        mockRabbitMqService.sendDataToAPI.mockRejectedValue(new Error("RabbitMQ error"));
        await expect(updateUserWithPhoneNumberService.execute(data)).rejects.toThrow("RabbitMQ error");
        expect(RabbitMqManageConnection).toHaveBeenCalledWith(RABBITMQ_HOST_URL);
        expect(mockRabbitMqService.sendDataToAPI).toHaveBeenCalledWith(
            data,
            RabbitMqQueues.UPDATE_USER_WITH_PHONE_NUMBER,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
    });
});
