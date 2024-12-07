import { NextFunction, Request, Response, Router } from "express";
import { AppError } from "millez-lib-api";
import fs from 'node:fs';
import path from "path";
const getProfileAvatarRouter = Router();

getProfileAvatarRouter.get('/', async (request: Request, response: Response, next: NextFunction) => {
    try {
        if (!request.query.id) throw new AppError('PROVIDE_AN_IMAGE_NAME');
        const imageId = request.query.id.toString();
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
