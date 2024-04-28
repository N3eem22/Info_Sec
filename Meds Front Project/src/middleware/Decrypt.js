function decrypt(text) {
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) throw new Error("Invalid input text format.");
        
        // Extract the IV and encrypted text from the input
        const iv = CryptoJS.enc.Hex.parse(textParts[0]);
        const encryptedText = CryptoJS.enc.Hex.parse(textParts[1]);
        
        // Assuming the key is properly set in the environment and is a 24-byte hex string
        const key = CryptoJS.enc.Hex.parse(process.env.REACT_APP_ENCRYPTION_KEY);

        // Configure decryption parameters
        const decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: encryptedText
        }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        // Convert decrypted data to UTF-8 string
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
}