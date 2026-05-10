const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

// POST /api/generate-notes
router.post('/generate-notes', notesController.generateNotes);

module.exports = router;
