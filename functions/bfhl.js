const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

function handleFile(fileBase64) {
    if (!fileBase64) return { valid: false, mimeType: null, sizeKb: null };
    const sizeKb = fileBase64.length / 1024;
    const mimeType = "application/octet-stream"; // Simplified for demo
    return { valid: true, mimeType, sizeKb };
}

app.post("/bfhl", (req, res) => {
    const { fullName, dob, fileBase64 } = req.body;

    if (!fullName || !dob) {
        return res.status(400).json({ is_success: false, error: "Missing fullName or dob" });
    }

    const userId = `${fullName.toLowerCase().replace(/\s+/g, "_")}_${dob}`;
    const fileInfo = handleFile(fileBase64);

    res.json({
        is_success: true,
        user_id: userId,
        file_valid: fileInfo.valid,
        file_mime_type: fileInfo.mimeType,
        file_size_kb: fileInfo.sizeKb,
    });
});

app.get("/bfhl", (req, res) => {
    res.json({ operation_code: 1 });
});

module.exports = app;
