const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const History = require('../models/History');
const Video = require('../models/Video');

// Helper functions to promisify NeDB operations
const findAsync = (query) => new Promise((resolve, reject) => {
    History.find(query, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
    });
});

const findVideoAsync = (query) => new Promise((resolve, reject) => {
    Video.find(query, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
    });
});

const removeAsync = (query) => new Promise((resolve, reject) => {
    History.remove(query, { multi: true }, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved);
    });
});

const insertAsync = (doc) => new Promise((resolve, reject) => {
    History.insert(doc, (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc);
    });
});

// POST /api/history - Add to watch history
router.post('/', auth, async (req, res) => {
    try {
        const { videoId } = req.body;

        // Remove old entry for same video (so it moves to top)
        await removeAsync({ userId: req.user.id, videoId });

        // Insert new entry
        const entry = await insertAsync({
            userId: req.user.id,
            videoId,
            watchedAt: new Date()
        });

        res.status(201).json(entry);
    } catch (err) {
        console.error('History error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/history - Get watch history
router.get('/', auth, async (req, res) => {
    try {
        const entries = await findAsync({ userId: req.user.id });
        
        // Sort by watchedAt descending
        entries.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));

        // Get the actual video data for each history entry
        const videoIds = entries.map(e => e.videoId);
        const videos = await findVideoAsync({ _id: { $in: videoIds } });

        // Maintain history order
        const videoMap = {};
        videos.forEach(v => { videoMap[v._id] = v; });
        const ordered = entries
            .map(e => videoMap[e.videoId])
            .filter(v => v != null);

        res.json(ordered);
    } catch (err) {
        console.error('History fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/history - Clear all history
router.delete('/', auth, async (req, res) => {
    try {
        await removeAsync({ userId: req.user.id });
        res.json({ message: 'History cleared' });
    } catch (err) {
        console.error('History clear error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;