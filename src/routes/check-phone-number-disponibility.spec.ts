import request from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import checkPhoneNumberDisponibilityRouter from './check-phone-number-disponibility';
import { VALIDATE_TOKEN } from '../constants/validate-token';
import { GET_TOKEN_DATA } from '../constants/get-token-data';
import CheckPhoneNumberDisponibilityService from '../services/CheckPhoneNumberDisponibilityService';

jest.mock('../services/CheckPhoneNumberDisponibilityService');
jest.mock('../constants/get-token-data');
jest.mock('../constants/validate-token');

const app = express();
app.use(express.json());
app.use('/check-phone-number', checkPhoneNumberDisponibilityRouter);

describe('checkPhoneNumberDisponibilityRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return phone number availability when phone number is available', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: 'user-id' });
        (CheckPhoneNumberDisponibilityService.prototype.execute as jest.Mock).mockResolvedValue(true);
        const response = await request(app)
            .post('/check-phone-number')
            .send({ phoneNumber: '1234567890' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ isAvailable: true });
        expect(CheckPhoneNumberDisponibilityService.prototype.execute).toHaveBeenCalledWith({
            phoneNumber: '1234567890',
            userId: 'user-id',
        });
    });

    it('should return 500 when phone number is unavailable', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: 'user-id' });
        (CheckPhoneNumberDisponibilityService.prototype.execute as jest.Mock).mockResolvedValue(false);
        const response = await request(app)
            .post('/check-phone-number')
            .send({ phoneNumber: '1234567890' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });

    it('should return 404 if user is not found', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue(null);
        const response = await request(app)
            .post('/check-phone-number')
            .send({ phoneNumber: '1234567890' });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });

    it('should handle unexpected errors', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockRejectedValue(new Error('Unexpected error'));
        const response = await request(app)
            .post('/check-phone-number')
            .send({ phoneNumber: '1234567890' });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
    });
});
