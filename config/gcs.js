// Google Cloud Storage configuration for image uploads
const { Storage } = require('@google-cloud/storage');
const bucketName = 'brighter_day';

let storageConfig = {};
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
	storageConfig.credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
}
const storage = new Storage(storageConfig);
const bucket = storage.bucket(bucketName);
module.exports = bucket;