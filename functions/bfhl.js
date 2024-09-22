const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

function handleFile(fileBase64) {
    if (!fileBase64) return { valid: false, mimeType: null, sizeKb: null };
    const sizeKb = fileBase64.length / 1024; // Simplified size calculation
    const mimeType = "image/png"; // Adjust as necessary
    return { valid: true, mimeType, sizeKb };
}

app.post("/bfhl", (req, res) => {
    const { data, file_b64 } = req.body;

    if (!data || !file_b64) {
        return res.status(400).json({ is_success: false, error: "Missing data or file_b64" });
    }

    const fullName = "Sanjay Aaditya"; // Use your full name here
    const dob = "15022003"; // Your DOB here
    const userId = `${fullName.replace(/\s+/g, "_").toLowerCase()}_${dob}`;
    const emailId = "sanjayaaditya@xyz.com"; // Your email here
    const rollNumber = "ABCD123"; // Your roll number here

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const highestLowercaseAlphabet = alphabets.filter(c => c === c.toLowerCase()).sort().slice(-1);

    const fileInfo = handleFile(file_b64);

    res.json({
        is_success: true,
        user_id: userId,
        email: emailId,
        roll_number: rollNumber,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileInfo.valid,
        file_mime_type: fileInfo.mimeType,
        file_size_kb: fileInfo.sizeKb,
    });
});

app.get("/bfhl", (req, res) => {
    res.json({ operation_code: 1 });
});

module.exports = app;
