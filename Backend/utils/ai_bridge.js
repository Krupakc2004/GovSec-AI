const { execFile } = require("child_process");
const path = require("path");

// Absolute path to the Python CLI utility in the parent project
const PYTHON_CLI_PATH = "c:\\Users\\SVI\\OneDrive\\Desktop\\Projects(working)\\Admin(GovSecAi)\\api\\ai_cli.py";

/**
 * Runs Python ai_cli.py subprocess to compute OpenCV CV and TextBlob NLP metrics.
 * 
 * @param {Object} options
 * @param {string} options.mode - "nlp", "cv", or "all"
 * @param {string} [options.text] - Complaint text to analyze
 * @param {string} [options.imagePath] - File path of uploaded image evidence
 * @returns {Promise<Object>} Returns parsed JSON result from Python engine
 */
function runAiEngine({ mode, text = "", imagePath = "" }) {
    return new Promise((resolve, reject) => {
        const args = ["--mode", mode];
        if (text) {
            args.push("--text", text);
        }
        if (imagePath) {
            args.push("--image", imagePath);
        }

        // Run python child process using direct argument array (protects against shell injection)
        execFile("python", [PYTHON_CLI_PATH, ...args], (error, stdout, stderr) => {
            if (error) {
                console.error("AI Bridge error:", stderr || error.message);
                return reject(new Error(stderr || error.message || "Failed to execute Python AI engine."));
            }

            try {
                const parsed = JSON.parse(stdout.trim());
                if (parsed.error) {
                    return reject(new Error(parsed.error));
                }
                resolve(parsed);
            } catch (err) {
                console.error("AI Bridge failed to parse stdout:", stdout);
                reject(new Error("Invalid JSON response from AI engine."));
            }
        });
    });
}

module.exports = { runAiEngine };
