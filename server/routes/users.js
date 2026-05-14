const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Video = require('../models/Video');
const Subscription = require('../models/Subscription');

const resolveUserParam = (param, cb) => {
    User.findOne({
        $or: [
            { _id: param },
            { username: new RegExp(`^${param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        ]
    }, (err, user) => {
        if (err) return cb(err);
        if (!user) return cb(null, null);
        cb(null, user._id);
    });
};

// POST /api/users/:id/subscribe - Toggle subscribe
router.post('/:id/subscribe', auth, (req, res) => {
    const requestedId = req.params.id;
    const subscriberId = req.user.id;

    resolveUserParam(requestedId, (err, channelId) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!channelId) return res.status(404).json({ error: 'User not found' });
        if (channelId === subscriberId) {
            return res.status(400).json({ error: 'Cannot subscribe to yourself' });
        }

        Subscription.findOne({ subscriberId, channelId }, (err, existing) => {
            if (err) return res.status(500).json({ error: 'Server error' });

            if (existing) {
                Subscription.remove({ _id: existing._id }, {}, (err) => {
                    if (err) return res.status(500).json({ error: 'Server error' });
                    res.json({ subscribed: false });
                });
            } else {
                Subscription.insert({
                    subscriberId,
                    channelId,
                    createdAt: Date.now()
                }, (err) => {
                    if (err) return res.status(500).json({ error: 'Server error' });
                    res.json({ subscribed: true });
                });
            }
        });
    });
});

// GET /api/users/:id/check-subscription
router.get('/:id/check-subscription', auth, (req, res) => {
    const requestedId = req.params.id;

    resolveUserParam(requestedId, (err, channelId) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!channelId) return res.status(404).json({ error: 'User not found' });

        Subscription.findOne({ subscriberId: req.user.id, channelId }, (err, sub) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            res.json({ subscribed: !!sub });
        });
    });
});

// GET /api/users/feed/subscriptions - Subscription feed
router.get('/feed/subscriptions', auth, (req, res) => {
    Subscription.find({ subscriberId: req.user.id }, (err, subs) => {
        if (err) return res.status(500).json({ error: 'Server error' });

        const channelIds = subs.map(s => s.channelId);
        Video.find({ userId: { $in: channelIds } })
            .sort({ createdAt: -1 })
            .exec((err, videos) => {
                if (err) return res.status(500).json({ error: 'Server error' });
                res.json(videos);
            });
    });
});

// GET /api/users/:id - Get user profile
router.get('/:id', (req, res) => {
    const requestedId = req.params.id;

    resolveUserParam(requestedId, (err, channelId) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!channelId) return res.status(404).json({ error: 'User not found' });

        User.findOne({ _id: channelId }, (err, user) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            if (!user) return res.status(404).json({ error: 'User not found' });

            Video.find({ userId: channelId })
                .sort({ createdAt: -1 })
                .exec((err, videos) => {
                    if (err) return res.status(500).json({ error: 'Server error' });
                    Subscription.count({ channelId }, (err, subCount) => {
                        if (err) return res.status(500).json({ error: 'Server error' });
                        res.json({
                            user: {
                                id: user._id,
                                username: user.username,
                                subscribers: subCount,
                                createdAt: user.createdAt
                            },
                            videos
                        });
                    });
                });
        });
    });
});

module.exports = router;
