// Google Cloud Storage configuration for image uploads
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Path to your service account key
const keyFilename = path.join(__dirname, '../gcs-key.json');

// Your bucket name (replace with your actual bucket name)
const bucketName = 'brighter_day';

const storage = new Storage({ keyFilename });
const bucket = storage.bucket(bucketName);

module.exports = bucket;