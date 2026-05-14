const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Video = require('../models/Video');
const { extractYouTubeId, getThumbnail } = require('../utils/youtube');

// GET /api/videos - Get all videos (with optional search & category)
router.get('/', (req, res) => {
    const { search, category } = req.query;
    let query = {};

    if (category) {
        query.category = category;
    }

    if (search) {
        // NeDB supports RegExp for partial matching
        query.title = new RegExp(search, 'i');
    }

    Video.find(query)
        .sort({ createdAt: -1 })
        .exec((err, videos) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            res.json(videos);
        });
});

// GET /api/videos/:id - Get single video
router.get('/:id', (req, res) => {
    Video.findOne({ _id: req.params.id }, (err, video) => {
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.json(video);
    });
});

// POST /api/videos - Upload a new video (auth required)
router.post('/', auth, (req, res) => {
    const { youtubeUrl, title, description, category } = req.body;

    // Extract YouTube video ID from the URL
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    const newVideo = {
        userId: req.user.id,
        username: req.user.username,
        title,
        description,
        youtubeUrl,
        videoId,
        thumbnail: getThumbnail(videoId),
        category: category || 'Other',
        views: 0,
        likes: [],      // array of user IDs
        dislikes: [],   // array of user IDs
        createdAt: Date.now()
    };

    Video.insert(newVideo, (err, video) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.status(201).json(video);
    });
});

// PUT /api/videos/:id - Update video (owner only)
router.put('/:id', auth, (req, res) => {
    const { title, description, category } = req.body;

    Video.findOne({ _id: req.params.id }, (err, video) => {
        if (!video) return res.status(404).json({ error: 'Video not found' });
        if (video.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        Video.update(
            { _id: req.params.id },
            { $set: { title, description, category } },
            {},
            (err) => {
                if (err) return res.status(500).json({ error: 'Server error' });
                res.json({ message: 'Video updated' });
            }
        );
    });
});

// DELETE /api/videos/:id - Delete video (owner only)
router.delete('/:id', auth, (req, res) => {
    Video.findOne({ _id: req.params.id }, (err, video) => {
        if (!video) return res.status(404).json({ error: 'Video not found' });
        if (video.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        Video.remove({ _id: req.params.id }, {}, (err) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            res.json({ message: 'Video deleted' });
        });
      });
});
// POST /api/videos/:id/like
router.post('/:id/like', auth, (req, res) => {
    const { action } = req.body; // 'like' or 'dislike'
    const userId = req.user.id;

    Video.findOne({ _id: req.params.id }, (err, video) => {
        if (!video) return res.status(404).json({ error: 'Video not found' });

        let update = {};

        if (action === 'like') {
            // Remove from dislikes if present, toggle like
            const alreadyLiked = video.likes.includes(userId);
            update = {
                $set: {
                    likes: alreadyLiked
                        ? video.likes.filter(id => id !== userId)
                        : [...video.likes, userId],
                    dislikes: video.dislikes.filter(id => id !== userId)
                }
            };
        } else {
            const alreadyDisliked = video.dislikes.includes(userId);
            update = {
                $set: {
                    dislikes: alreadyDisliked
                        ? video.dislikes.filter(id => id !== userId)
                        : [...video.dislikes, userId],
                    likes: video.likes.filter(id => id !== userId)
                }
            };
        }

        Video.update({ _id: req.params.id }, update, {}, (err) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            // Return updated video
            Video.findOne({ _id: req.params.id }, (err, updated) => {
                res.json(updated);
            });
        });
    });
});

// POST /api/videos/:id/view
router.post('/:id/view', (req, res) => {
    Video.update(
        { _id: req.params.id },
        { $set: {} },  // We use a workaround below
        {},
        (err) => {
            // NeDB doesn't have $inc, so we do it manually
            Video.findOne({ _id: req.params.id }, (err, video) => {
                if (!video) return res.status(404).json({ error: 'Not found' });
                Video.update(
                    { _id: req.params.id },
                    { $set: { views: video.views + 1 } },
                    {},
                    (err) => {
                        if (err) return res.status(500).json({ error: 'Server error' });
                        res.json({ views: video.views + 1 });
                    }
                );
            });
        }
    );
});

module.exports = router;