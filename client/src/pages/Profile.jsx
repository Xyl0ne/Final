import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

export default function Profile() {
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🔹 Fetch user + videos + subscription status
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await API.get(`/users/${id}`);
                setUser(userRes.data);

                // If your backend sends videos inside user:
                setVideos(userRes.data.videos || []);

                // Check subscription
                const subRes = await API.get(`/users/${id}/check-subscription`);
                setIsSubscribed(subRes.data.subscribed);

            } catch (err) {
                console.error("PROFILE ERROR:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // 🔹 Subscribe / Unsubscribe
    const handleSubscribe = async () => {
        try {
            await API.post(`/users/${id}/subscribe`);

            // Toggle UI immediately
            setIsSubscribed(prev => !prev);

            // Update subscriber count (optional but nice UX)
            setUser(prev => ({
                ...prev,
                subscribers: prev.subscribers + (isSubscribed ? -1 : 1)
            }));

        } catch (err) {
            console.error("SUBSCRIBE ERROR:", err);
        }
    };

    // 🔹 Loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Typography textAlign="center">User not found</Typography>;
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 5 }}>

            {/* 🔹 User Info */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4">{user.username}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Subscribers: {user.subscribers}
                </Typography>

                <Button
                    variant={isSubscribed ? "outlined" : "contained"}
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleSubscribe}
                >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Button>
            </Paper>

            {/* 🔹 Videos Grid */}
            <Typography variant="h5" gutterBottom>
                Videos
            </Typography>

            <Grid container spacing={2}>
                {videos.length > 0 ? (
                    videos.map((video) => (
                        <Grid item xs={12} sm={6} md={4} key={video._id}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="subtitle1">
                                    {video.title}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))
                ) : (
                    <Typography sx={{ ml: 2 }}>No videos uploaded</Typography>
                )}
            </Grid>
        </Box>
    );
}