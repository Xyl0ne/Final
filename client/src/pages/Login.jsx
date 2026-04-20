import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await API.post('/auth/login', { email, password });
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant='h5' gutterBottom
                sx={{
                    color: 'secondary.main'
                }}>Sign In</Typography>
                {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
                <Box component='form' onSubmit={handleSubmit} >
                    <TextField fullWidth  label='Email' margin='normal' 
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField fullWidth label='Password' type='password' margin='normal'
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button fullWidth variant='contained' type='submit' sx={{ mt: 2,
                        color: 'secondary.main'
                     }}>
                        Sign In
                    </Button>
                </Box>
                <Typography sx={{ mt: 2, textAlign: 'center' }}>
                    Don't have an account? <Link to='/register'>Sign Up</Link>
                </Typography>
            </Paper>
        </Box>
    );
}