const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Bookmark = require('../models/Bookmark');
const axios = require('axios');
const cheerio = require('cheerio');

// Fetch title from URL
async function fetchTitle(url) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(response.data);
    return $('title').text() || url;
  } catch (error) {
    return url;
  }
}

// Get all bookmarks with search and filter
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

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single bookmark
router.get('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.userId });
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create bookmark
router.post('/', auth, [
  body('url').isURL().withMessage('Valid URL is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let { url, title, description, tags, isFavorite } = req.body;
    
    // Auto-fetch title if not provided
    if (!title) {
      title = await fetchTitle(url);
    }

    const bookmark = new Bookmark({
      url,
      title,
      description: description || '',
      tags: tags || [],
      isFavorite: isFavorite || false,
      user: req.userId
    });
    
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update bookmark
router.put('/:id', auth, [
  body('url').optional().isURL().withMessage('Valid URL is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete bookmark
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.userId });
    
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json({ message: 'Bookmark deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
