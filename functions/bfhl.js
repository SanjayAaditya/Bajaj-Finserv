const bodyParser = require("body-parser");

function handleFile(fileBase64) {
    if (!fileBase64) return { valid: false, mimeType: null, sizeKb: null };
    const sizeKb = Buffer.from(fileBase64, 'base64').length / 1024; // Calculate size in KB
    const mimeType = "application/octet-stream"; // Simplified for demo
    return { valid: true, mimeType, sizeKb };
}

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ is_success: false, error: "Method Not Allowed" }),
        };
    }

    const { fullName, dob, fileBase64 } = JSON.parse(event.body);

    if (!fullName || !dob) {
        return {
            statusCode: 400,
            body: JSON.stringify({ is_success: false, error: "Missing fullName or dob" }),
        };
    }

    const userId = `${fullName.toLowerCase().replace(/\s+/g, "_")}_${dob}`;
    const fileInfo = handleFile(fileBase64);

    return {
        statusCode: 200,
        body: JSON.stringify({
            is_success: true,
            user_id: userId,
            file_valid: fileInfo.valid,
            file_mime_type: fileInfo.mimeType,
            file_size_kb: fileInfo.sizeKb,
        }),
    };
};
