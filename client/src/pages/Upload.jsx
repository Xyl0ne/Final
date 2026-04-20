import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

const CATEGORIES = ['Music', 'Gaming', 'Education', 'Sports',
    'Entertainment', 'News', 'Other'];

export default function Upload() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        youtubeUrl: '', title: '', description: '', category: 'Other'
    });
    const [error, setError] = useState('');
    const [preview, setPreview] = useState('');

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setForm({ ...form, youtubeUrl: url });

        // Show thumbnail preview as they type
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
        const match = url.match(regex);
        if (match) {
            setPreview(`https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`);
        } else {
            setPreview('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await API.post('/videos', form);
            navigate(`/watch/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper sx={{ p: 4, width: 600 }}>
                <Typography variant='h5' gutterBottom>Upload Video</Typography>
                {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

                <Box component='form' onSubmit={handleSubmit}>
                    <TextField fullWidth label='YouTube URL' margin='normal'
                        value={form.youtubeUrl} onChange={handleUrlChange}
                        placeholder='https://www.youtube.com/watch?v=...' />

                    {/* Thumbnail Preview */}
                    {preview && (
                        <Box sx={{ my: 2 }}>
                            <img src={preview} alt='Preview'
                                style={{ width: '100%', borderRadius: 8 }} />
                        </Box>
                    )}

                    <TextField fullWidth label='Title' margin='normal'
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })} />

                    <TextField fullWidth label='Description' margin='normal'
                        multiline rows={3} value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })} />

                    <TextField fullWidth select label='Category' margin='normal'
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        {CATEGORIES.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </TextField>

                    <Button fullWidth variant='contained' type='submit' sx={{ mt: 2 }}>
                        Upload
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}