// Import the required modules
const { Storage } = require("@google-cloud/storage");

// Create a new Storage client
const storage = new Storage({
    projectId: "my-project-id",
    keyFilename: "path/to/serviceAccountKey.json",
});

// Define the bucket name and options
const bucketName = "my-bucket-name";
const bucketOptions = {
    versioning: {
        enabled: true,
    },
    location: "us-central1",
};

// Create the bucket if it doesn't exist
async function createBucket() {
    const [bucket] = await storage.createBucket(bucketName, bucketOptions);
    console.log(`Bucket ${bucket.name} created.`);
}

// Upload a file to the bucket
async function uploadFile(file) {
    const bucket = storage.bucket(bucketName);
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileOptions = {
        metadata: {
            contentType: file.mimetype,
        },
    };

    const blob = bucket.file(fileName);

    return new Promise((resolve, reject) => {
        const stream = blob.createWriteStream(fileOptions);

        stream.on("finish", () => {
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
            resolve(publicUrl);
        });

        stream.on("error", (error) => {
            reject(error);
        });

        stream.end(file.buffer);
    });
}

// Export the cloudStorage object
const cloudStorage = {
    createBucket,
    upload: uploadFile,
};

module.exports = cloudStorage;