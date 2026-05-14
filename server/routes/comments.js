const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');

// GET /api/comments/:videoId
router.get('/:videoId', (req, res) => {
    Comment.find({ videoId: req.params.videoId })
        .sort({ createdAt: -1 })
        .exec((err, comments) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            res.json(comments);
        });
});

// POST /api/comments/:videoId
router.post('/:videoId', auth, (req, res) => {
    const newComment = {
        videoId: req.params.videoId,
        userId: req.user.id,
        username: req.user.username,
        text: req.body.text,
        likes: [],
        createdAt: Date.now()
    };

    Comment.insert(newComment, (err, comment) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.status(201).json(comment);
    });
});

// DELETE /api/comments/:id
router.delete('/:id', auth, (req, res) => {
    Comment.findOne({ _id: req.params.id }, (err, comment) => {
        if (!comment) return res.status(404).json({ error: 'Not found' });
        if (comment.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        Comment.remove({ _id: req.params.id }, {}, (err) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            res.json({ message: 'Comment deleted' });
        });
    });
});

// POST /api/comments/:id/like
router.post('/:id/like', auth, (req, res) => {
    Comment.findOne({ _id: req.params.id }, (err, comment) => {
        if (!comment) return res.status(404).json({ error: 'Not found' });
        const userId = req.user.id;
        const alreadyLiked = comment.likes.includes(userId);
        const newLikes = alreadyLiked
            ? comment.likes.filter(id => id !== userId)
            : [...comment.likes, userId];

        Comment.update(
            { _id: req.params.id },
            { $set: { likes: newLikes } },
            {},
            (err) => {
                if (err) return res.status(500).json({ error: 'Server error' });
                Comment.findOne({ _id: req.params.id }, (err, updated) => {
                    res.json(updated);
                });
            }
        );
    });
});

module.exports = router;