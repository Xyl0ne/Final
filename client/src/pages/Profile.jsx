import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [watchHistory, setWatchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [profileResponse, historyResponse] = await Promise.all([
                API.get(`/users/${user.id}`),
                API.get('/history')
            ]);
            setProfileData(profileResponse.data);
            setWatchHistory(historyResponse.data);
        } catch (err) {
            setError('Failed to load profile data');
            console.error(err);
        }
        setLoading(false);
    };

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Typography>Please log in to view your profile</Typography>
            </Box>
        );
    }

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
            </Paper>

            {/* User's Videos */}
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Your Videos ({profileData.videos.length})
            </Typography>

            {profileData.videos.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    You haven't uploaded any videos yet.
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

            {/* Watch History */}
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
        </Box>
    );
};

export default Profile;