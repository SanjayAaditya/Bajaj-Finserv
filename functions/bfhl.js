const express = require("express");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");

const app = express();
app.use(bodyParser.json());

function handleFile(fileBase64) {
    if (!fileBase64) return { valid: false, mimeType: null, sizeKb: null };
    const sizeKb = Buffer.from(fileBase64, 'base64').length / 1024; // Calculate size in KB
    const mimeType = "application/octet-stream"; // Default MIME type for demo
    return { valid: true, mimeType, sizeKb };
}

app.post("/bfhl", (req, res) => {
    const { data, file_b64 } = req.body;

    // Static user data
    const userId = "Sanjay_Aaditya_15022003";
    const email = "sanjayaaditya@xyz.com";
    const rollNumber = "ABCD123";

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, error: "Invalid data input" });
    }

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const highestLowercaseAlphabet = alphabets.filter(char => char === char.toLowerCase()).sort().slice(-1);

    const fileInfo = handleFile(file_b64);

    res.json({
        is_success: true,
        user_id: userId,
        email: email,
        roll_number: rollNumber,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileInfo.valid,
        file_mime_type: fileInfo.mimeType,
        file_size_kb: fileInfo.sizeKb,
    });
});

// GET endpoint
app.get("/bfhl", (req, res) => {
    res.json({ operation_code: 1 });
});

// Export for Netlify Functions
module.exports.handler = serverless(app);
