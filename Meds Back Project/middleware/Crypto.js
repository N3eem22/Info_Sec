const crypto = require('crypto');

// Adjusting the key length to 24 bytes for 3DES
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
//console.log("Key Length:", ENCRYPTION_KEY.length);  // Should print 24

const IV_LENGTH = 8; // For 3DES, this is typically 8

function encrypt(text) {
    try {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('des-ede3-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Encryption failed:', error);
        return null;
    }
}

function decrypt(text) {
    try {
        let textParts = text.split(':');
        if (textParts.length !== 2) throw new Error("Invalid input text format.");
        let iv = Buffer.from(textParts[0], 'hex');
        let encryptedText = Buffer.from(textParts[1], 'hex');
        let decipher = crypto.createDecipheriv('des-ede3-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
}

module.exports = { encrypt, decrypt };
