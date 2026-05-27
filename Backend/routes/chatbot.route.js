const express = require("express");
const { chatHandler } = require("../controllers/chatbot.controller.js");

const router = express.Router();

router.post("/chat", chatHandler);

module.exports = router;
