import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

export default function VideoCard({ video }) {
    const navigate = useNavigate();
    const [isHovering, setIsHovering] = useState(false);

    // Format relative time (e.g., '3 days ago')
    const timeAgo = (date) => {
        const seconds = Math.floor((Date.now() - date) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
        ];
        for (const { label, seconds: s } of intervals) {
            const count = Math.floor(seconds / s);
            if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
        }
        return 'Just now';
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <Card
            sx={{
                width: '300px',
                cursor: 'pointer',
                bgcolor: 'background.paper',
                boxShadow: 'none',
                '&:hover': { opacity: 0.9 },
                border: "2px solid #676666",
                boxShadow: '1px 1px 20px rgba(210, 214, 227, 0.2)'
            }}
            onClick={() => navigate(`/watch/${video._id}`)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Box sx={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                <CardMedia
                    component='img'
                    image={video.thumbnail}
                    alt={video.title}
                    sx={{ aspectRatio: '16/9', borderRadius: 2, width: '100%', height: '100%' }}
                />
                {isHovering && (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
                        title={video.title}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            borderRadius: 8,
                            width: '100%',
                            height: '100%'
                        }}
                    />
                )}
            </Box>
            <CardContent sx={{ px: 0, pt: 1, pl: 2 }}>
                <Typography variant='subtitle1' fontWeight='bold' noWrap>
                    {video.title}
                </Typography>
                <Box sx={{
                    display:'flex',
                    alignItems: 'center',
                    gap: 1,
                    
                }}>
                    <Avatar sx={{
                        bgcolor: 'red',
                        fontSize: '15px',
                    }}>
                        {video.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant='body2' color='text.secondary'>
                        {video.username}
                    </Typography>
                </Box>

                <Typography variant='body2' color='text.secondary'>
                    {video.views} views · {timeAgo(video.createdAt)}
                </Typography>
            </CardContent>
        </Card>
    );
}