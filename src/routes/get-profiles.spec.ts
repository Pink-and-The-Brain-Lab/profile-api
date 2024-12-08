import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import getProfilesRouter from './get-profiles';
import { VALIDATE_TOKEN } from '../constants/validate-token';
import { GET_TOKEN_DATA } from '../constants/get-token-data';
import GetProfilesService from '../services/GetProfilesService';

jest.mock('../constants/get-token-data');
jest.mock('../constants/validate-token');
jest.mock('../services/GetProfilesService');

const app = express();
app.use(express.json());
app.use('/get-profiles', getProfilesRouter);

describe('getProfilesRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return profiles when the user is authenticated', async () => {
        const mockUserId = 'user123';
        const mockProfiles = [
            { id: 'profile1', name: 'Profile 1' },
            { id: 'profile2', name: 'Profile 2' },
        ];
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: mockUserId });
        (GetProfilesService.prototype.execute as jest.Mock).mockResolvedValue(mockProfiles);
        const response = await request(app).get('/get-profiles');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ profiles: mockProfiles });
        expect(GET_TOKEN_DATA.get).toHaveBeenCalledWith(expect.any(Object));
        expect(GetProfilesService.prototype.execute).toHaveBeenCalledWith(mockUserId);
    });

    it('should return 404 if user is not found', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue(null);
        const response = await request(app).get('/get-profiles');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });

    it('should handle errors during profile fetching', async () => {
        const mockError = new Error('Something went wrong');
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockRejectedValue(mockError);
        const response = await request(app).get('/get-profiles');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
        expect(GET_TOKEN_DATA.get).toHaveBeenCalledWith(expect.any(Object));
    });
});



// describe('getProfilesRouter', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should fetch profiles for a valid user', async () => {
//         // Mock VALIDATE_TOKEN middleware
//         (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());

//         // Mock GET_TOKEN_DATA.get
//         (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: 'user-id' });

//         // Mock GetProfilesService
//         (GetProfilesService.prototype.execute as jest.Mock).mockResolvedValue([
//             { id: 'profile-1', name: 'Profile 1' },
//             { id: 'profile-2', name: 'Profile 2' },
//         ]);

//         const response = await request(app).get('/get-profiles');

//         expect(response.status).toBe(200);
//         expect(response.body).toEqual({
//             profiles: [
//                 { id: 'profile-1', name: 'Profile 1' },
//                 { id: 'profile-2', name: 'Profile 2' },
//             ],
//         });
//         expect(GetProfilesService.prototype.execute).toHaveBeenCalledWith('user-id');
//     });

//     it('should return 404 if user is not found', async () => {
//         // Mock VALIDATE_TOKEN middleware
//         (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());

//         // Mock GET_TOKEN_DATA.get to return null
//         (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue(null);

//         const response = await request(app).get('/get-profiles');

//         expect(response.status).toBe(404);
//         expect(response.body).toEqual({ message: 'USER_NOT_FOUND' });
//     });

//     it('should handle errors during profile fetching', async () => {
//         // Mock VALIDATE_TOKEN middleware
//         (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());

//         // Mock GET_TOKEN_DATA.get
//         (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: 'user-id' });

//         // Mock GetProfilesService to throw an error
//         (GetProfilesService.prototype.execute as jest.Mock).mockRejectedValue(new AppError('PROFILE_FETCH_FAILED', 500));

//         const response = await request(app).get('/get-profiles');

//         expect(response.status).toBe(500);
//         expect(response.body).toEqual({ message: 'PROFILE_FETCH_FAILED' });
//     });
// });
