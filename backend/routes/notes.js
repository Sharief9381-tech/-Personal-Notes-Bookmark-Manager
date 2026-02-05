const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// Get all notes with search and filter
router.get('/', auth, async (req, res) => {
  try {
    const { q, tags } = req.query;
    let query = { user: req.userId };

    if (q) {
      query.$text = { $search: q };
    }

    if (tags) {
      query.tags = { $in: tags.split(',').map(t => t.trim().toLowerCase()) };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create note
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const note = new Note({
      ...req.body,
      user: req.userId
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
