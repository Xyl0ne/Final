import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const Profile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [watchHistory, setWatchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const isCurrentUser = user?.id === id;

    useEffect(() => {
        fetchData();
    }, [id, user]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const profileResponse = await API.get(`/users/${id}`);
            setProfileData(profileResponse.data);

            if (isCurrentUser) {
                const historyResponse = await API.get('/history');
                setWatchHistory(historyResponse.data);
            } else {
                setWatchHistory([]);
                if (user) {
                    try {
                        const { data: subData } = await API.get(`/users/${id}/check-subscription`);
                        setSubscribed(subData.subscribed);
                    } catch (checkErr) {
                        console.error('Subscription check failed:', checkErr);
                    }
                }
            }
        } catch (err) {
            const serverMessage = err.response?.data?.error || err.message || 'Failed to load profile data';
            setError(serverMessage);
            console.error('Profile fetch error:', err);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ px: 3, py: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ px: 3, py: 2 }}>
            {/* Profile Header */}
            <Paper sx={{ p: 3, mb: 3, }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            sx={{ width: 80, height: 80, bgcolor: 'red' }}
                        >
                            {profileData.user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                {profileData.user.username}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {profileData.user.subscribers} subscribers
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Joined {new Date(profileData.user.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>
                    {!isCurrentUser && (
                        <Button
                            variant='contained'
                            color={subscribed ? 'secondary' : 'primary'}
                            disabled={!user}
                            onClick={async () => {
                                if (!user) return;
                                try {
                                    const { data } = await API.post(`/users/${id}/subscribe`);
                                    setSubscribed(data.subscribed);
                                    setProfileData((prev) => ({
                                        ...prev,
                                        user: {
                                            ...prev.user,
                                            subscribers: prev.user.subscribers + (data.subscribed ? 1 : -1)
                                        }
                                    }));
                                } catch (err) {
                                    console.error('Subscribe request failed:', err);
                                }
                            }}
                        >
                            {user ? (subscribed ? 'Subscribed' : 'Subscribe') : 'Sign in to subscribe'}
                        </Button>
                    )}
                </Box>
            </Paper>

            {/* User's Videos */}
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                {isCurrentUser ? 'Your Videos' : 'Videos'} ({profileData.videos.length})
            </Typography>

            {profileData.videos.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    {isCurrentUser
                        ? "You haven't uploaded any videos yet."
                        : 'This user has not uploaded any videos yet.'}
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {profileData.videos.map((video) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                            <VideoCard video={video} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {isCurrentUser && (
                <>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2, mt: 4 }}>
                        Watch History ({watchHistory.length})
                    </Typography>

                    {watchHistory.length === 0 ? (
                        <Typography variant="body1" color="text.secondary">
                            You haven't watched any videos yet.
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {watchHistory.map((video) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                                    <VideoCard video={video} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}
        </Box>
    );
};

export default Profile;