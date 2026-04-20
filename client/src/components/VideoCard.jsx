import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function VideoCard({ video }) {
    const navigate = useNavigate();

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

    return (
        <Card
            sx={{
                cursor: 'pointer',
                bgcolor: 'background.paper',
                boxShadow: 'none',
                '&:hover': { opacity: 0.9 },
            }}
            onClick={() => navigate(`/watch/${video._id}`)}
        >
            <CardMedia
                component='img'
                image={video.thumbnail}
                alt={video.title}
                sx={{ aspectRatio: '16/9', borderRadius: 2 }}
            />
            <CardContent sx={{ px: 0, pt: 1 }}>
                <Typography variant='subtitle1' fontWeight='bold' noWrap>
                    {video.title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    {video.username}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    {video.views} views · {timeAgo(video.createdAt)}
                </Typography>
            </CardContent>
        </Card>
    );
}