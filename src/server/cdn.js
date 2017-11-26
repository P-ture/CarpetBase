
import cloudinary from 'cloudinary';

// Configure Cloundinary with the API keys.
cloudinary.config({
    cloud_name: process.env.CARPETBASE_CL_NAME, 
    api_key: process.env.CARPETBASE_CL_KEY, 
    api_secret: process.env.CARPETBASE_CL_SECRET
});

export default cloudinary;
