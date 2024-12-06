import request from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import { AppError } from 'millez-lib-api/dist/errors/AppError';
import createProfileRouter from './create-profile';
import { VALIDATE_TOKEN } from '../constants/validate-token';
import { GET_TOKEN_DATA } from '../constants/get-token-data';
import CreateProfileService from '../services/CreateProfileService';
import SetSelectedProfile from '../services/SetSelectedProfile';

jest.mock('../services/CreateProfileService');
jest.mock('../services/SetSelectedProfile');
jest.mock('../constants/get-token-data');
jest.mock('../constants/validate-token');

const app = express();
app.use(express.json());
app.use('/create-profile', createProfileRouter);

describe('createProfileRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a profile and set it as selected', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: 'user-id' });
        (CreateProfileService.prototype.execute as jest.Mock).mockResolvedValue({ id: 'profile-id' });
        (SetSelectedProfile.prototype.execute as jest.Mock).mockResolvedValue(true);
        const response = await request(app)
            .post('/create-profile')
            .send({ name: 'Test Profile' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ profileId: 'profile-id' });
        expect(CreateProfileService.prototype.execute).toHaveBeenCalledWith({ name: 'Test Profile' }, 'user-id');
        expect(SetSelectedProfile.prototype.execute).toHaveBeenCalledWith('profile-id', 'user-id');
    });

    it('should return 404 if user is not found', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue(null);
        const response = await request(app)
            .post('/create-profile')
            .send({ name: 'Test Profile' });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });

    it('should handle errors during profile creation', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: 'user-id' });
        (CreateProfileService.prototype.execute as jest.Mock).mockRejectedValue(new AppError('API_ERRORS.PROFILE_CREATION_FAILED', 500));
        const response = await request(app)
            .post('/create-profile')
            .send({ name: 'Test Profile' });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
    });

    it('should handle errors during setting selected profile', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: 'user-id' });
        (CreateProfileService.prototype.execute as jest.Mock).mockResolvedValue({ id: 'profile-id' });
        (SetSelectedProfile.prototype.execute as jest.Mock).mockRejectedValue(new AppError('API_ERRORS.SET_SELECTED_PROFILE_FAILED', 500));
        const response = await request(app)
            .post('/create-profile')
            .send({ name: 'Test Profile' });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
    });
});
