import request from 'supertest';
import express, { NextFunction } from 'express';
import ValidationTokenService from '../services/ValidationTokenService';
import validationTokenRouter from './validation-token';
import { VALIDATE_TOKEN } from '../constants/validate-token';

jest.mock('../constants/validate-token');
jest.mock('../services/ValidationTokenService');

const app = express();
app.use(express.json());
app.use('/validate-token', validationTokenRouter);

describe('validationTokenRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should validate the token and return a success response', async () => {
        const mockToken = '123456';
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (ValidationTokenService.prototype.execute as jest.Mock).mockResolvedValue(true);
        const response = await request(app)
            .post('/validate-token')
            .send({ token: mockToken });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ validated: true });
        expect(ValidationTokenService.prototype.execute).toHaveBeenCalledWith(mockToken);
    });

    it('should handle errors from the ValidationTokenService', async () => {
        const mockToken = '123456';
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (ValidationTokenService.prototype.execute as jest.Mock).mockResolvedValue({ statusCode: 500 });
        const response = await request(app)
            .post('/validate-token')
            .send({ token: mockToken });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
        expect(ValidationTokenService.prototype.execute).toHaveBeenCalledWith(mockToken);
    });

    it('should handle unexpected errors', async () => {
        const mockError = new Error('Something went wrong');
        (VALIDATE_TOKEN.validate as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (ValidationTokenService.prototype.execute as jest.Mock).mockRejectedValue(mockError);
        const response = await request(app)
            .post('/validate-token')
            .send({ token: '123456' });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
        expect(ValidationTokenService.prototype.execute).toHaveBeenCalledWith('123456');
    });
});