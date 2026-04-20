import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CommentSection({ videoId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        API.get(`/comments/${videoId}`)
            .then(({ data }) => setComments(data))
            .catch(console.error);
    }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            const { data } = await API.post(`/comments/${videoId}`, { text });
            setComments([data, ...comments]);
            setText('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await API.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant='h6'>{comments.length} Comments</Typography>

            {/* Add Comment */}
            {user && (
                <Box component='form' onSubmit={handleSubmit}
                    sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField fullWidth variant='standard'
                        placeholder='Add a comment...'
                        value={text} onChange={(e) => setText(e.target.value)} />
                    <Button type='submit' variant='contained'>Comment</Button>
                </Box>
            )}

            {/* Comment List */}
            {comments.map((comment) => (
                <Box key={comment._id} sx={{
                    mt: 2, py: 1,
                    borderBottom: 1, borderColor: 'divider'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='subtitle2' fontWeight='bold'>
                            {comment.username}
                        </Typography>
                        {user && user.id === comment.userId && (
                            <IconButton size='small'
                                onClick={() => handleDelete(comment._id)}>
                                <DeleteIcon fontSize='small' />
                            </IconButton>
                        )}
                    </Box>
                    <Typography variant='body2'>{comment.text}</Typography>
                </Box>
            ))}
        </Box>
    );
}