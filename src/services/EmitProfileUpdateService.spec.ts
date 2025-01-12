import { AppError } from 'millez-lib-api';
import { AppDataSource } from '../data-source';
import EmitProfileUpdateService from './EmitProfileUpdateService';
import { orderDataBy } from '../utils/order-data-by';
import { socketConnection } from '../web-socket';

jest.mock('millez-lib-api');
jest.mock('../data-source');
jest.mock('../web-socket', () => ({
    socketConnection: {
        emit: jest.fn(),
    },
}));
jest.mock('../utils/order-data-by', () => ({
    orderDataBy: jest.fn(),
}));

describe('EmitProfileUpdateService', () => {
    let mockProfileRepository: any;

    beforeEach(() => {
        mockProfileRepository = {
            findBy: jest.fn(),
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockProfileRepository);
        jest.clearAllMocks();
    });

    it('should emit reordered profiles if profiles exist', async () => {
        const service = new EmitProfileUpdateService();
        const userId = 'user123';
        const mockProfiles = [
            { id: 1, createdat: 2 },
            { id: 2, createdat: 1 },
        ];
        const reorderedProfiles = [
            { id: 2, createdat: 1 },
            { id: 1, createdat: 2 },
        ];
        mockProfileRepository.findBy.mockResolvedValue(mockProfiles);
        (orderDataBy as jest.Mock).mockReturnValue(reorderedProfiles);
        await service.execute(userId);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ userId });
        expect(orderDataBy).toHaveBeenCalledWith(mockProfiles, 'createdat');
        expect(socketConnection.emit).toHaveBeenCalledWith('profiles', reorderedProfiles);
    });

    it('should not emit anything if no profiles exist', async () => {
        const service = new EmitProfileUpdateService();
        const userId = 'user123';
        mockProfileRepository.findBy.mockResolvedValue([]);
        await service.execute(userId);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ userId });
        expect(orderDataBy).not.toHaveBeenCalled();
        expect(socketConnection.emit).not.toHaveBeenCalled();
    });

    it('should throw an AppError if an unexpected error occurs', async () => {
        const service = new EmitProfileUpdateService();
        const userId = 'user123';
        mockProfileRepository.findBy.mockRejectedValue(new Error('Unexpected error'));
        await expect(service.execute(userId)).rejects.toBeInstanceOf(AppError);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ userId });
        expect(orderDataBy).not.toHaveBeenCalled();
        expect(socketConnection.emit).not.toHaveBeenCalled();
    });
});
