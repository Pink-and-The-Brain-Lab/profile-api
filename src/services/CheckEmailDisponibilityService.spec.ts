import { RabbitMqManageConnection, RabbitMqMessagesProducerService } from 'millez-lib-api';
import CheckEmailDisponibilityService from './CheckEmailDisponibilityService';
import { IEmailDiponibility } from '../routes/interfaces/email-disponibility.inteface';
import { RabbitMqQueues } from '../enums/rabbitmq-queues.enum';

jest.mock('millez-lib-api');

describe('CheckEmailDisponibilityService', () => {
    it('should return email availability', async () => {
        (RabbitMqManageConnection as jest.Mock).mockImplementation(() => ({}));
        const mockSendDataToAPI = jest.fn().mockResolvedValue({ isAvailable: true });
        (RabbitMqMessagesProducerService as jest.Mock).mockImplementation(() => ({
            sendDataToAPI: mockSendDataToAPI,
        }));
        const service = new CheckEmailDisponibilityService();
        const mockData: IEmailDiponibility = { email: 'test@example.com', userId: '1' };
        const result = await service.execute(mockData);
        expect(mockSendDataToAPI).toHaveBeenCalledWith(
            mockData,
            RabbitMqQueues.CHECK_EMAIL_DISPONIBILITY,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
        expect(result).toEqual({ isAvailable: true });
    });

    it('should return email unavailable', async () => {
        (RabbitMqManageConnection as jest.Mock).mockImplementation(() => ({}));
        const mockSendDataToAPI = jest.fn().mockResolvedValue({ isAvailable: false });
        (RabbitMqMessagesProducerService as jest.Mock).mockImplementation(() => ({
            sendDataToAPI: mockSendDataToAPI,
        }));
        const service = new CheckEmailDisponibilityService();
        const mockData: IEmailDiponibility = { email: 'test@example.com', userId: '1' };
        const result = await service.execute(mockData);
        expect(mockSendDataToAPI).toHaveBeenCalledWith(
            mockData,
            RabbitMqQueues.CHECK_EMAIL_DISPONIBILITY,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
        expect(result).toEqual({ isAvailable: false });
    });
});
