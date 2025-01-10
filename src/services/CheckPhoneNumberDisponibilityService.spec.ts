import { RabbitMqManageConnection, RabbitMqMessagesProducerService } from 'millez-lib-api';
import CheckPhoneNumberDisponibilityService from './CheckPhoneNumberDisponibilityService';
import { IPhoneNumberDiponibility } from '../routes/interfaces/phone-number-disponibility.inteface';
import { RabbitMqQueues } from '../enums/rabbitmq-queues.enum';

jest.mock('millez-lib-api');

describe('CheckPhoneNumberDisponibilityService', () => {
    it('should return phone number availability when available', async () => {
        (RabbitMqManageConnection as jest.Mock).mockImplementation(() => ({}));
        const mockSendDataToAPI = jest.fn().mockResolvedValue(true);
        (RabbitMqMessagesProducerService as jest.Mock).mockImplementation(() => ({
            sendDataToAPI: mockSendDataToAPI,
        }));
        const service = new CheckPhoneNumberDisponibilityService();
        const mockData: IPhoneNumberDiponibility = { phoneNumber: '1234567890', userId: '1' };
        const result = await service.execute(mockData);
        expect(mockSendDataToAPI).toHaveBeenCalledWith(
            mockData,
            RabbitMqQueues.CHECK_PHONE_NUMBER_DISPONIBILITY,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
        expect(result).toBe(true);
    });

    it('should return false when phone number is unavailable', async () => {
        (RabbitMqManageConnection as jest.Mock).mockImplementation(() => ({}));
        const mockSendDataToAPI = jest.fn().mockResolvedValue(false);
        (RabbitMqMessagesProducerService as jest.Mock).mockImplementation(() => ({
            sendDataToAPI: mockSendDataToAPI,
        }));
        const service = new CheckPhoneNumberDisponibilityService();
        const mockData: IPhoneNumberDiponibility = { phoneNumber: '1234567890', userId: '1' };
        const result = await service.execute(mockData);
        expect(mockSendDataToAPI).toHaveBeenCalledWith(
            mockData,
            RabbitMqQueues.CHECK_PHONE_NUMBER_DISPONIBILITY,
            RabbitMqQueues.PROFILE_RESPONSE_QUEUE
        );
        expect(result).toBe(false);
    });
});
