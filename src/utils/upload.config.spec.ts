import multer from 'multer';
import path from 'path';
import { uploadConfig } from './upload.config';

jest.mock('multer', () => ({
    diskStorage: jest.fn(),
}));

jest.mock('path', () => ({
    join: jest.fn(),
}));

describe('uploadConfig', () => {
    it('should configure multer with the correct storage options', () => {
        const mockDestination = jest.fn();
        const mockFilename = jest.fn();
        (multer.diskStorage as jest.Mock).mockImplementation((options) => {
            options.destination({}, {}, mockDestination);
            options.filename({}, { originalname: 'test.jpg' }, mockFilename);
            return {};
        });
        (path.join as jest.Mock).mockReturnValue('/mocked/path/uploads/images');
        uploadConfig.storage;
        expect(path.join).toHaveBeenCalledWith(__dirname, '..', 'uploads', 'images');
        expect(multer.diskStorage).toHaveBeenCalledWith({
            destination: undefined,
            filename: expect.any(Function),
        });
        const callback = jest.fn().mockReturnValue(mockFilename.mock.calls[0]);
        callback(null, 'mocked-file-name.jpg');
    });
});
