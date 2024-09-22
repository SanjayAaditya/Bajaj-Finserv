const bodyParser = require("body-parser");

function handleFile(fileBase64) {
    if (!fileBase64) return { valid: false, mimeType: null, sizeKb: null };
    const sizeKb = Buffer.from(fileBase64, 'base64').length / 1024; // Calculate size in KB
    const mimeType = "application/octet-stream"; // Simplified for demo
    return { valid: true, mimeType, sizeKb };
}

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        // Handle GET request
        return {
            statusCode: 200,
            body: JSON.stringify({ operation_code: 1 }),
        };
    } else if (event.httpMethod === "POST") {
        // Handle POST request
        const { fullName, dob, data, file_b64 } = JSON.parse(event.body);

        if (!fullName || !dob) {
            return {
                statusCode: 400,
                body: JSON.stringify({ is_success: false, error: "Missing fullName or dob" }),
            };
        }

        const userId = `${fullName.toLowerCase().replace(/\s+/g, "_")}_${dob}`;
        const fileInfo = handleFile(file_b64);

        // Separate numbers and alphabets
        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item));

        // Find the highest lowercase alphabet
        const lowercaseAlphabets = alphabets.filter(char => char >= 'a' && char <= 'z');
        const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets[lowercaseAlphabets.length - 1]] : [];

        // Construct the response
        return {
            statusCode: 200,
            body: JSON.stringify({
                is_success: true,
                user_id: userId,
                email: "john@xyz.com", // Placeholder for email
                roll_number: "ABCD123", // Placeholder for roll number
                numbers: numbers,
                alphabets: alphabets,
                highest_lowercase_alphabet: highestLowercaseAlphabet,
                file: {
                    valid: fileInfo.valid,
                    mime_type: fileInfo.mimeType,
                    size_kb: fileInfo.sizeKb,
                },
            }),
        };
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ is_success: false, error: "Method Not Allowed" }),
        };
    }
};
