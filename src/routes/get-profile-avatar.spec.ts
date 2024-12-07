import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';
import getProfileAvatarRouter from './get-profile-avatar';

jest.mock('fs');
jest.mock('path');

const app = express();
app.use('/get-profile-avatar', getProfileAvatarRouter);

describe('getProfileAvatarRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the image when it exists', async () => {
        const mockImageId = 'image-mock.jpg';
        const mockImagePath = `./src/uploads/images/${mockImageId}`;
        const mockImageBuffer = Buffer.from('mock-image-data');
        (path.join as jest.Mock).mockReturnValue(mockImagePath);
        (fs.readFileSync as jest.Mock).mockReturnValue(mockImageBuffer);
        const response = await request(app).get('/get-profile-avatar').query({ id: mockImageId });
        expect(response.status).toBe(200);
        expect(response.header['content-type']).toBe('image/jpg');
    });

    it('should return an error when the image name is not provided', async () => {
        const response = await request(app).get('/get-profile-avatar');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });

    it('should handle errors when the image does not exist', async () => {
        const mockImageId = 'nonexistent.png';
        const mockImagePath = `/mock/uploads/images/${mockImageId}`;
        (path.join as jest.Mock).mockReturnValue(mockImagePath);
        (fs.readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('File not found');
        });
        const response = await request(app).get('/get-profile-avatar').query({ id: mockImageId });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
    });
});
