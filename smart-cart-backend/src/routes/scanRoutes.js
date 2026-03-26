const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

let scanProcess = null;

// Start YOLO detection
router.post("/start", (req, res) => {
    const { cartId } = req.body;

    if (!cartId) {
        return res.status(400).json({ error: "cartId is required" });
    }

    // Kill existing process if running
    if (scanProcess) {
        scanProcess.kill();
        scanProcess = null;
    }

    const detectScript = path.resolve(__dirname, "../../../detect.py");

    scanProcess = spawn("python", [detectScript, cartId], {
        cwd: path.resolve(__dirname, "../../.."),
    });

    scanProcess.stdout.on("data", (data) => {
        console.log(`[YOLO] ${data.toString().trim()}`);
    });

    scanProcess.stderr.on("data", (data) => {
        console.error(`[YOLO ERROR] ${data.toString().trim()}`);
    });

    scanProcess.on("close", (code) => {
        console.log(`[YOLO] Process exited with code ${code}`);
        scanProcess = null;
    });

    res.status(200).json({ success: true, message: "Scan started" });
});

// Stop YOLO detection
router.post("/stop", (req, res) => {
    if (scanProcess) {
        scanProcess.kill();
        scanProcess = null;
        return res.status(200).json({ success: true, message: "Scan stopped" });
    }
    res.status(200).json({ success: true, message: "No scan was running" });
});

module.exports = router;
