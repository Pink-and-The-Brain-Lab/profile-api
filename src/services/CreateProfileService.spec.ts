import { AppDataSource } from '../data-source';
import CreateProfileService from './CreateProfileService';
import { ICreateProfile } from '../routes/interfaces/create-profile.interface';
import Profile from '../models/profile.model';
import { AppError } from 'millez-lib-api';

jest.mock('../data-source');
jest.mock('millez-lib-api');

describe('CreateProfileService', () => {
    let mockProfileRepository: any;

    beforeEach(() => {
        mockProfileRepository = {
            findBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockProfileRepository);
    });

    it('should create a new profile when less than 3 profiles exist', async () => {
        const service = new CreateProfileService();
        const mockData: ICreateProfile = { email: 'test@example.com' };
        const userId = 'user123';
        mockProfileRepository.findBy.mockResolvedValue([]); // No existing profiles
        mockProfileRepository.create.mockReturnValue(new Profile());
        mockProfileRepository.save.mockResolvedValue({
            email: mockData.email,
            userId,
            selected: true,
            createdat: expect.any(Number),
        });
        const result = await service.execute(mockData, userId);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ userId });
        expect(mockProfileRepository.create).toHaveBeenCalled();
        expect(mockProfileRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            email: mockData.email,
            userId,
            selected: true,
        }));
        expect(result).toEqual(expect.objectContaining({
            email: mockData.email,
            userId,
            selected: true,
        }));
    });

    it('should throw an error if the user already has 3 profiles', async () => {
        const service = new CreateProfileService();
        const mockData: ICreateProfile = { email: 'test@example.com' };
        const userId = 'user123';
        mockProfileRepository.findBy.mockResolvedValue([{}, {}, {}]);
        await expect(service.execute(mockData, userId)).rejects.toBeInstanceOf(AppError);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ userId });
        expect(mockProfileRepository.create).not.toHaveBeenCalled();
        expect(mockProfileRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an AppError if an unexpected error occurs', async () => {
        const service = new CreateProfileService();
        const mockData: ICreateProfile = { email: 'test@example.com' };
        const userId = 'user123';
        mockProfileRepository.findBy.mockRejectedValue(new Error('Unexpected error'));
        await expect(service.execute(mockData, userId)).rejects.toBeInstanceOf(AppError);
        expect(mockProfileRepository.findBy).toHaveBeenCalledWith({ userId });
    });
});
