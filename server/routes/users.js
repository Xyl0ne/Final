const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Video = require('../models/Video');
const Subscription = require('../models/Subscription');

// GET /api/users/:id - Get user profile
router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Get user's videos
        Video.find({ userId: req.params.id })
            .sort({ createdAt: -1 })
            .exec((err, videos) => {
                // Get subscriber count
                Subscription.count({ channelId: req.params.id }, (err, subCount) => {
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

// POST /api/users/:id/subscribe - Toggle subscribe
router.post('/:id/subscribe', auth, (req, res) => {
    const channelId = req.params.id;
    const subscriberId = req.user.id;

    if (channelId === subscriberId) {
        return res.status(400).json({ error: 'Cannot subscribe to yourself' });
    }

    Subscription.findOne({ subscriberId, channelId }, (err, existing) => {
        if (existing) {
            // Unsubscribe
            Subscription.remove({ _id: existing._id }, {}, (err) => {
                res.json({ subscribed: false });
            });
        } else {
            // Subscribe
            Subscription.insert({
                subscriberId,
                channelId,
                createdAt: Date.now()
            }, (err, sub) => {
                res.json({ subscribed: true });
            });
        }
    });
});

// GET /api/users/:id/check-subscription
router.get('/:id/check-subscription', auth, (req, res) => {
    Subscription.findOne({
        subscriberId: req.user.id,
        channelId: req.params.id
    }, (err, sub) => {
        res.json({ subscribed: !!sub });
    });
});

// GET /api/users/feed/subscriptions - Subscription feed
router.get('/feed/subscriptions', auth, (req, res) => {
    Subscription.find({ subscriberId: req.user.id }, (err, subs) => {
        const channelIds = subs.map(s => s.channelId);

        Video.find({ userId: { $in: channelIds } })
            .sort({ createdAt: -1 })
            .exec((err, videos) => {
                res.json(videos);
            });
    });
});

module.exports = router;