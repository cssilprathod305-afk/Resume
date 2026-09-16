const express = require("express");

const {
    saveResume,
    loadResume
} = require("../controllers/resumeController");

const router = express.Router();

// Save resume
router.post("/save", saveResume);

// Load resume
router.get("/load/:user_id", loadResume);

module.exports = router;