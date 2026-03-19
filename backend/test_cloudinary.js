const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
    try {
        console.log('Testing Cloudinary with:', process.env.CLOUDINARY_CLOUD_NAME);
        const result = await cloudinary.api.ping();
        console.log('Cloudinary response:', result);
        console.log('✅ Cloudinary is configured correctly!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Cloudinary configuration failed:');
        console.error(err.message);
        process.exit(1);
    }
}

testCloudinary();
