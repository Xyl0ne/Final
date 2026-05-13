import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function CommentSection({ videoId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, commentId: null });

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

    const handleDeleteClick = (commentId) => {
        setDeleteDialog({ open: true, commentId });
    };

    const handleConfirmDelete = async () => {
        const { commentId } = deleteDialog;
        try {
            await API.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
            setDeleteDialog({ open: false, commentId: null });
        } catch (err) {
            console.error(err);
            alert('Failed to delete comment');
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialog({ open: false, commentId: null });
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='subtitle2' fontWeight='bold'>
                            {comment.username}
                        </Typography>
                        {user && user.id === comment.userId && (
                            <IconButton size='small' color='error'
                                onClick={() => handleDeleteClick(comment._id)}>
                                <DeleteIcon fontSize='small' />
                            </IconButton>
                        )}
                    </Box>
                    <Typography variant='body2'>{comment.text}</Typography>
                </Box>
            ))}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Delete Comment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this comment? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color='error' variant='contained'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}