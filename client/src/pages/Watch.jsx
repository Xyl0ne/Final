import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LikeDislike from '../components/LikeDislike';
import CommentSection from '../components/CommentSection';
import VideoCard from '../components/VideoCard';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';

export default function Watch() {
    const { id } = useParams();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [suggested, setSuggested] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch video data
                const { data: videoData } = await API.get(`/videos/${id}`);
                setVideo(videoData);

                // Increment view count
                await API.post(`/videos/${id}/view`);

                // Add to watch history (if logged in)
                if (user) {
                    await API.post('/history', { videoId: id });
                }

                // Fetch suggested videos (same category)
                const { data: allVideos } = await API.get('/videos', {
                    params: { category: videoData.category }
                });
                setSuggested(allVideos.filter(v => v._id !== id).slice(0, 8));
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);
    if (!video) return <Typography sx={{ m: 4 }}>Video not found</Typography>;

    return (
        <Box sx={{ px: 3, py: 2, mt: 4 }}>
            <Box sx={{ display: 'flex'}}>
                {/* Main Video Column */}
                <Box sx={{ flex: 1, mr: 4 }}>
                    {/* YouTube Player */}
                    <Box sx={{
                        position: 'relative',
                        paddingTop: '56.25%',  // 16:9 ratio
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}>
                        <iframe
                            src={`https://www.youtube.com/embed/${video.videoId}`}
                            title={video.title}
                            allowFullScreen
                            allow='autoplay; encrypted-media'
                            style={{
                                position: 'absolute',
                                top: 0, left: 0,
                                width: '100%', height: '100%',
                                border: 'none',
                            }}
                            autoPlay = {true}
                            width={300}
                        />
                    </Box>

                    {/* Video Info */}
                    <Typography variant='h5' sx={{ mt: 2, fontWeight: 'bold' }}>
                        {video.title}
                    </Typography>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', mt: 1
                    }}>
                        <Typography color='text.secondary'>
                            {video.views} views
                        </Typography>
                        <LikeDislike video={video} setVideo={setVideo} color="secondary" />
                    </Box>

                    {/* Channel Info */}
                    <Box sx={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 2, py: 2,
                        borderTop: 1, borderBottom: 1, borderColor: 'divider',
                    }}>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 2
                        }}>
                            <Avatar
                                sx={{  bgcolor: 'red' }}
                            >
                                {video.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography>
                                {video.username}
                            </Typography>
                        </Box>
                        <Button variant='contained' color='primary' sx={{
                            bgcolor: 'background.paper'
                        }}>
                            Subscribe
                        </Button>
                    </Box>

                    {/* Description */}
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                        <Typography variant='body1'>{video.description}</Typography>
                    </Box>

                    {/* Comments */}
                    <CommentSection videoId={id} sx={{
                        bgcolor: 'background.paper'
                    }} />
                </Box>

                {/* Suggested Videos Sidebar */}
                <Grid item xs={12} md={4}>
                    
                    {suggested.map((v) => (
                        <Box key={v._id} sx={{ mb: 2 }}>
                            <VideoCard video={v} />
                        </Box>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}