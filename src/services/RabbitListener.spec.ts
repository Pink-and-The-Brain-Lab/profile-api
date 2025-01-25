import { RabbitMqListener, RabbitMqManageConnection } from 'millez-lib-api';
import RabbitListener from './RabbitListener';
import { RABBITMQ_HOST_URL } from '../constants/rabbitmq-host-url';
import { RabbitMqQueues } from '../enums/rabbitmq-queues.enum';
import CreateProfileService from './CreateProfileService';
import { IEmailDiponibility } from '../routes/interfaces/email-disponibility.inteface';
import { IProfile } from '../routes/interfaces/proifle.inteface';

jest.mock('millez-lib-api', () => ({
    RabbitMqListener: jest.fn(),
    RabbitMqManageConnection: jest.fn(),
}));

jest.mock('./CreateProfileService');

describe('RabbitListener', () => {
    let mockConnection: any;
    let mockRabbitListener: any;

    beforeEach(() => {
        mockConnection = {};
        (RabbitMqManageConnection as jest.Mock).mockImplementation(() => mockConnection);

        mockRabbitListener = {
            genericListener: jest.fn(),
        };
        (RabbitMqListener as jest.Mock).mockImplementation(() => mockRabbitListener);
    });

    it('should set up a listener for CREATE_PROFILE_AFTER_SIGNUP queue', async () => {
        const rabbitListener = new RabbitListener();
        await rabbitListener.listeners();
        expect(RabbitMqManageConnection).toHaveBeenCalledWith(RABBITMQ_HOST_URL);
        expect(RabbitMqListener).toHaveBeenCalledWith(mockConnection);
        expect(mockRabbitListener.genericListener).toHaveBeenCalledWith(
            RabbitMqQueues.CREATE_PROFILE_AFTER_SIGNUP,
            expect.any(Function)
        );
    });

    it('should call CreateProfileService.execute when createwProfileAfterSignup is invoked', async () => {
        const mockCreateProfileService = {
            execute: jest.fn(),
        };
        (CreateProfileService as jest.Mock).mockImplementation(() => mockCreateProfileService);
        const rabbitListener = new RabbitListener();
        const mockEmailDisponibility: IEmailDiponibility = {
            userId: 'user123',
            email: 'test@example.com',
        };
        const mockProfile: IProfile = {
            id: 'profile123',
            userId: 'user123',
            email: 'test@example.com',
        };
        mockCreateProfileService.execute.mockResolvedValue(mockProfile);
        const result = await (rabbitListener as any).createwProfileAfterSignup(mockEmailDisponibility);
        expect(mockCreateProfileService.execute).toHaveBeenCalledWith(
            { email: 'test@example.com' },
            'user123'
        );
        expect(result).toEqual(mockProfile);
    });

    it('should return an error if CreateProfileService.execute throws an error', async () => {
        const mockCreateProfileService = {
            execute: jest.fn(),
        };
        (CreateProfileService as jest.Mock).mockImplementation(() => mockCreateProfileService);
        const rabbitListener = new RabbitListener();
        const mockEmailDisponibility: IEmailDiponibility = {
            userId: 'user123',
            email: 'test@example.com',
        };
        const mockError = new Error('Failed to create profile');
        mockCreateProfileService.execute.mockRejectedValue(mockError);
        const result = await (rabbitListener as any).createwProfileAfterSignup(mockEmailDisponibility);
        expect(mockCreateProfileService.execute).toHaveBeenCalledWith(
            { email: 'test@example.com' },
            'user123'
        );
        expect(result).toEqual(mockError);
    });
});
