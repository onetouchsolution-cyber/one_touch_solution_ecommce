const { google } = require('googleapis');
const stream = require('stream');

/**
 * Uploads an image buffer to Google Drive and makes it publicly viewable.
 * Supporting both Service Account and OAuth2 authentication.
 * 
 * @param {string} fileName The name of the file to save as on Google Drive
 * @param {Buffer} fileBuffer The binary file buffer
 * @param {string} mimeType The mime-type of the file (e.g., 'image/jpeg')
 * @returns {Promise<string>} The direct download URL for the uploaded file
 */
const uploadToDrive = async (fileName, fileBuffer, mimeType) => {
    let auth;

    // 1. Service Account Authentication
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                // Replace escaped newlines with actual newline characters
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: [
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/drive'
            ],
        });
    }
    // 2. OAuth2 Refresh Token Authentication
    else if (
        process.env.GOOGLE_DRIVE_CLIENT_ID &&
        process.env.GOOGLE_DRIVE_CLIENT_SECRET &&
        process.env.GOOGLE_DRIVE_REFRESH_TOKEN
    ) {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_DRIVE_CLIENT_ID,
            process.env.GOOGLE_DRIVE_CLIENT_SECRET
        );
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
        });
        auth = oauth2Client;
    } else {
        throw new Error(
            'Google Drive is not configured. Please add either Service Account credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY) or OAuth2 keys (GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REFRESH_TOKEN) to your .env file.'
        );
    }

    const drive = google.drive({ version: 'v3', auth });

    // Convert Buffer to readable stream for googleapis
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    const fileMetadata = {
        name: fileName,
        parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : undefined,
    };

    const media = {
        mimeType: mimeType,
        body: bufferStream,
    };

    // Create the file in Google Drive
    const file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
    });

    const fileId = file.data.id;

    // Set permission to anyone so the file can be read publically via a direct download link
    try {
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
    } catch (permError) {
        console.warn('Unable to set Google Drive file permissions to public: ', permError.message);
    }

    // Direct download link format:
    // https://drive.google.com/uc?export=download&id=FILE_ID
    const directLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

    return directLink;
};

module.exports = {
    uploadToDrive,
};
