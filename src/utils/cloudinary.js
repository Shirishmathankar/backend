import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const uploadcloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) {
            return null;
        }

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto',
        });

        
        await fs.promises.unlink(localfilepath);
        return response;
    } catch (error) {
        // Handle upload error
        console.error('Cloudinary Upload Error:', error);

        // Remove the file from the local server
        try {
            await fs.promises.unlink(localfilepath);
        } catch (unlinkError) {
            console.error('Error deleting local file:', unlinkError);
        }

        return { success: false, error: error.message };
    }
};

export default uploadcloudinary;
