import request from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import { VALIDATE_TOKEN } from '../constants/validate-token';
import { GET_TOKEN_DATA } from '../constants/get-token-data';
import UpdateUserWithPhoneNumberService from '../services/UpdateUserWithPhoneNumberService';
import setPhoneNumberRouter from './set-phone-number';

jest.mock('../constants/validate-token');
jest.mock('../constants/get-token-data');
jest.mock('../services/UpdateUserWithPhoneNumberService');

const app = express();
app.use(express.json());
app.use('/set-phone-number', setPhoneNumberRouter);

describe('setPhoneNumberRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update the phone number successfully', async () => {
        const mockUserId = '12345';
        const mockRequestBody = { phoneNumber: '1234567890' };
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: mockUserId });
        (UpdateUserWithPhoneNumberService.prototype.execute as jest.Mock).mockResolvedValue({});
        const response = await request(app)
            .post('/set-phone-number')
            .send(mockRequestBody);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ updated: true });
        expect(GET_TOKEN_DATA.get).toHaveBeenCalled();
        expect(UpdateUserWithPhoneNumberService.prototype.execute).toHaveBeenCalledWith({
            ...mockRequestBody,
            userId: mockUserId,
        });
    });

    it('should return 404 if user is not found', async () => {
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue(null);
        const response = await request(app)
            .post('/set-phone-number')
            .send({ phoneNumber: '1234567890' });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });

    it('should handle service errors', async () => {
        const mockUserId = '12345';
        const mockRequestBody = { phoneNumber: '1234567890' };
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: mockUserId });
        (UpdateUserWithPhoneNumberService.prototype.execute as jest.Mock).mockResolvedValue({
            statusCode: 400,
            message: 'Invalid phone number',
        });
        const response = await request(app)
            .post('/set-phone-number')
            .send(mockRequestBody);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });

    it('should handle unexpected errors', async () => {
        const mockUserId = '12345';
        const mockRequestBody = { phoneNumber: '1234567890' };
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (GET_TOKEN_DATA.get as jest.Mock).mockResolvedValue({ sub: mockUserId });
        (UpdateUserWithPhoneNumberService.prototype.execute as jest.Mock).mockRejectedValue(
            new Error('Unexpected error')
        );
        const response = await request(app)
            .post('/set-phone-number')
            .send(mockRequestBody);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
    });
});
