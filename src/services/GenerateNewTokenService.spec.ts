import { AppError, RabbitMqMessagesProducerService, ValidateEmail } from 'millez-lib-api';
import { GenerateNewTokenService } from './GenerateNewTokenService';
import { RabbitMqQueues } from '../enums/rabbitmq-queues.enum';

jest.mock('millez-lib-api');

describe('GenerateNewTokenService', () => {
    let mockValidateEmail: jest.Mock;
    let mockSendDataToAPI: jest.Mock;

    beforeEach(() => {
        mockValidateEmail = jest.fn();
        (ValidateEmail as jest.Mock).mockImplementation(() => ({
            validate: mockValidateEmail,
        }));
        mockSendDataToAPI = jest.fn();
        (RabbitMqMessagesProducerService as jest.Mock).mockImplementation(() => ({
            sendDataToAPI: mockSendDataToAPI,
        }));
        jest.clearAllMocks();
    });

    it('should return a validation token if email is valid', async () => {
        const service = new GenerateNewTokenService();
        const email = 'test@example.com';
        const mockValidationToken = { token: '12345' };
        mockValidateEmail.mockReturnValue(true);
        mockSendDataToAPI.mockResolvedValue(mockValidationToken);
        const result = await service.execute(email);
        expect(mockValidateEmail).toHaveBeenCalledWith(email);
        expect(mockSendDataToAPI).toHaveBeenCalledWith(
            email,
            RabbitMqQueues.CREATE_TOKEN,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
        expect(result).toEqual(mockValidationToken);
    });

    it('should throw an AppError if email is invalid', async () => {
        const service = new GenerateNewTokenService();
        const email = 'invalid-email';
        mockValidateEmail.mockReturnValue(false);
        await expect(service.execute(email)).rejects.toBeInstanceOf(AppError);
        expect(mockValidateEmail).toHaveBeenCalledWith(email);
        expect(mockSendDataToAPI).not.toHaveBeenCalled();
    });

    it('should throw an error if RabbitMQ service fails', async () => {
        const service = new GenerateNewTokenService();
        const email = 'test@example.com';
        mockValidateEmail.mockReturnValue(true);
        mockSendDataToAPI.mockRejectedValue(new Error('RabbitMQ error'));
        await expect(service.execute(email)).rejects.toThrow('RabbitMQ error');
        expect(mockValidateEmail).toHaveBeenCalledWith(email);
        expect(mockSendDataToAPI).toHaveBeenCalledWith(
            email,
            RabbitMqQueues.CREATE_TOKEN,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
    });
});
