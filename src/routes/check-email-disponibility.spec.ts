import request from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import checkEmailDisponibilityRouter from './check-email-disponibility';
import { VALIDATE_TOKEN } from '../constants/validate-token';
import { GET_TOKEN_DATA } from '../constants/get-token-data';
import CheckEmailDisponibilityService from '../services/CheckEmailDisponibilityService';

jest.mock('../services/CheckEmailDisponibilityService');
jest.mock('../constants/get-token-data');
jest.mock('../constants/validate-token');

const app = express();
app.use(express.json());
app.use('/check-email', checkEmailDisponibilityRouter);

describe('checkEmailDisponibilityRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return email availability when email is available', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: 'user-id' });
        (CheckEmailDisponibilityService.prototype.execute as jest.Mock).mockResolvedValue(true);
        const response = await request(app)
            .post('/check-email')
            .send({ email: 'test@example.com' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ isAvailable: true });
        expect(CheckEmailDisponibilityService.prototype.execute).toHaveBeenCalledWith({
            email: 'test@example.com',
            userId: 'user-id',
        });
    });

    it('should return 404 if user is not found', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue(null);
        const response = await request(app)
            .post('/check-email')
            .send({ email: 'test@example.com' });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });

    it('should return 500 when email is unavailable', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: 'user-id' });
        (CheckEmailDisponibilityService.prototype.execute as jest.Mock).mockResolvedValue(false);
        const response = await request(app)
            .post('/check-email')
            .send({ email: 'test@example.com' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });

    it('should handle unexpected errors', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockRejectedValue(new Error('Unexpected error'));
        const response = await request(app)
            .post('/check-email')
            .send({ email: 'test@example.com' });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
    });
});
