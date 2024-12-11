import request from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import { VALIDATE_TOKEN } from '../constants/validate-token';
import { GET_TOKEN_DATA } from '../constants/get-token-data';
import GetProfileEmailService from '../services/GetProfileEmailService';
import UpdateProfileService from '../services/UpdateProfileService';
import updateProfileRouter from './update-profile';
import { GenerateNewTokenService } from '../services/GenerateNewTokenService';

jest.mock('../constants/validate-token');
jest.mock('../constants/get-token-data');
jest.mock('../services/GetProfileEmailService');
jest.mock('../services/GenerateNewTokenService');
jest.mock('../services/UpdateProfileService');

const app = express();
app.use(express.json());
app.use('/update-profile', updateProfileRouter);

describe('updateProfileRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update the profile successfully', async () => {
        const mockUserId = '12345';
        const mockRequestBody = { id: '1', phoneNumber: '1234567890' };
        const mockFile = { filename: 'image.jpg' };
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: mockUserId });
        (GetProfileEmailService.prototype.execute as jest.Mock).mockResolvedValue('test@example.com');
        (GenerateNewTokenService.prototype.execute as jest.Mock).mockResolvedValue({});
        (UpdateProfileService.prototype.execute as jest.Mock).mockResolvedValue({ id: '1', name: 'Test User' });

        const response = await request(app)
            .post('/update-profile')
            .field('id', mockRequestBody.id)
            .field('phoneNumber', mockRequestBody.phoneNumber)
            .attach('image', Buffer.from('test image content'), mockFile.filename);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ profile: { id: '1', name: 'Test User' } });
        expect(GET_TOKEN_DATA.get).toHaveBeenCalled();
        expect(GetProfileEmailService.prototype.execute).toHaveBeenCalledWith(mockRequestBody.id);
        expect(GenerateNewTokenService.prototype.execute).toHaveBeenCalledWith('test@example.com');
        expect(UpdateProfileService.prototype.execute).toHaveBeenCalledWith(
            expect.objectContaining({
                ...mockRequestBody,
                userId: { sub: mockUserId },
                email: 'test@example.com',
            })
        );
    });

    it('should return 404 if user is not found', async () => {
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue(null);
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());

        const response = await request(app)
            .post('/update-profile')
            .send({ id: '1', phoneNumber: '1234567890' });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });

    it('should handle service errors', async () => {
        const mockUserId = '12345';
        const mockRequestBody = { id: '1', phoneNumber: '1234567890' };
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());

        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: mockUserId });
        (GenerateNewTokenService.prototype.execute as jest.Mock).mockResolvedValue({
            statusCode: 400,
            message: 'Invalid token',
        });

        const response = await request(app)
            .post('/update-profile')
            .send(mockRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });

    it('should handle unexpected errors', async () => {
        const mockUserId = '12345';
        const mockRequestBody = { id: '1', phoneNumber: '1234567890' };
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());

        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: mockUserId });
        (UpdateProfileService.prototype.execute as jest.Mock).mockRejectedValue(
            new Error('Unexpected error')
        );

        const response = await request(app)
            .post('/update-profile')
            .send(mockRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });
});