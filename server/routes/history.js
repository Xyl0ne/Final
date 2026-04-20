const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const History = require('../models/History');
const Video = require('../models/Video');

// POST /api/history - Add to watch history
router.post('/', auth, (req, res) => {
    const { videoId } = req.body;

    // Remove old entry for same video (so it moves to top)
    History.remove(
        { userId: req.user.id, videoId },
        {},
        (err) => {
            History.insert({
                userId: req.user.id,
                videoId,
                watchedAt: Date.now()
            }, (err, entry) => {
                if (err) return res.status(500).json({ error: 'Server error' });
                res.status(201).json(entry);
            });
        }
    );
});

// GET /api/history - Get watch history
router.get('/', auth, (req, res) => {
    History.find({ userId: req.user.id })
        .sort({ watchedAt: -1 })
        .exec((err, entries) => {
            if (err) return res.status(500).json({ error: 'Server error' });

            // Get the actual video data for each history entry
            const videoIds = entries.map(e => e.videoId);
            Video.find({ _id: { $in: videoIds } }, (err, videos) => {
                // Maintain history order
                const videoMap = {};
                videos.forEach(v => { videoMap[v._id] = v; });
                const ordered = entries
                    .map(e => videoMap[e.videoId])
                    .filter(v => v != null);
                res.json(ordered);
            });
        });
});

// DELETE /api/history - Clear all history
router.delete('/', auth, (req, res) => {
    History.remove(
        { userId: req.user.id },
        { multi: true },
        (err) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            res.json({ message: 'History cleared' });
        }
    );
});

module.exports = router;