import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import selectProfileRouter from './select-profile';
import { VALIDATE_TOKEN } from '../constants/validate-token';
import { GET_TOKEN_DATA } from '../constants/get-token-data';
import SetSelectedProfile from '../services/SetSelectedProfile';

jest.mock('../constants/get-token-data');
jest.mock('../constants/validate-token');
jest.mock('../services/SetSelectedProfile');

const app = express();
app.use(express.json());
app.use('/select-profile', selectProfileRouter);

describe('selectProfileRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should set the selected profile successfully', async () => {
        const mockUserId = 'user123';
        const mockProfileId = 'profile123';
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: mockUserId });
        (SetSelectedProfile.prototype.execute as jest.Mock).mockResolvedValue(true);
        const response = await request(app)
            .post('/select-profile')
            .send({ profileId: mockProfileId });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ selected: true });
        expect(GET_TOKEN_DATA.get).toHaveBeenCalledWith(expect.any(Object));
        expect(SetSelectedProfile.prototype.execute).toHaveBeenCalledWith(mockProfileId, mockUserId);
    });

    it('should return 404 if user is not found', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue(null);
        const response = await request(app)
            .post('/select-profile')
            .send({ profileId: 'profile-id' });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });

    it('should handle errors gracefully', async () => {
        const mockError = new Error('Something went wrong');
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: 'user123' });
        (SetSelectedProfile.prototype.execute as jest.Mock).mockRejectedValue(mockError);
        const response = await request(app)
            .post('/select-profile')
            .send({ profileId: 'profile123' });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
        expect(GET_TOKEN_DATA.get).toHaveBeenCalledWith(expect.any(Object));
        expect(SetSelectedProfile.prototype.execute).toHaveBeenCalledWith('profile123', 'user123');
    });
});
