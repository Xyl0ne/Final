import { useState, useEffect } from 'react';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const CATEGORIES = ['All', 'Music', 'Gaming', 'Education', 'Sports',
    'Entertainment', 'News', 'Other'];

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const params = category !== 'All' ? { category } : {};
                const { data } = await API.get('/videos', { params });
                setVideos(data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchVideos();
    }, [category]);

    return (
        <Box sx={{ px: 3, py: 2 }}>
            {/* Category Chips */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto' }}>
                {CATEGORIES.map((cat) => (
                    <Chip
                        key={cat}
                        label={cat}
                        onClick={() => setCategory(cat)}
                        color={category === cat ? 'primary' : 'default'}
                        variant={category === cat ? 'filled' : 'outlined'}
                    />
                ))}
            </Box>

            {/* Video Grid */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : videos.length === 0 ? (
                <Typography color='text.secondary'>No videos found.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {videos.map((video) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                            <VideoCard video={video} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
      }