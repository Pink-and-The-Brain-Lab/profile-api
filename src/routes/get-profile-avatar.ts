import { NextFunction, Request, Response, Router } from "express";
import fs from 'node:fs';
import path from "path";
const getProfileAvatarRouter = Router();

getProfileAvatarRouter.get('/', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const imageId = request.query.id?.toString() || '';
        const imageType = imageId.split('.')[1];
        const contentType = `image/${imageType}`;
        const imagesFolder = path.join(__dirname, '..', 'uploads', 'images', imageId);
        var img = fs.readFileSync(imagesFolder);
        response.writeHead(200, {'Content-Type': contentType });
        return response.end(img, 'binary');
    } catch (error: any) {
        next(error);
    }
});

export default getProfileAvatarRouter;