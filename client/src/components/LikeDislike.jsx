import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';

export default function LikeDislike({ video, setVideo }) {
    const { user } = useAuth();

    const handleAction = async (action) => {
        if (!user) return alert('Please login first');
        try {
            const { data } = await API.post(`/videos/${video._id}/like`, { action });
            setVideo(data);
        } catch (err) {
            console.error(err);
        }
    };

    const liked = user && video.likes.includes(user.id);
    const disliked = user && video.dislikes.includes(user.id);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => handleAction('like')}>
                {liked ? <ThumbUpIcon color='secondary' /> : <ThumbUpOutlinedIcon color="secondary" />}
            </IconButton>
            <Typography>{video.likes.length}</Typography>
            <IconButton onClick={() => handleAction('dislike')}>
                {disliked ? <ThumbDownIcon color='error' /> : <ThumbDownOutlinedIcon color="secondary" />}
            </IconButton>
            <Typography>{video.dislikes.length}</Typography>
        </Box>
    );
}