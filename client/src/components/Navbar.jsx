import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import VideoCallIcon from '@mui/icons-material/VideoCall';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
        }
    };

    return (
        <AppBar position='fixed' sx={{ bgcolor: 'background.paper' }}>
            <Toolbar>
                {/* Logo */}
                <Typography
                    variant='h6'
                    sx={{ cursor: 'pointer', color: 'secondary.main', fontWeight: 'bold' }}
                    onClick={() => navigate('/')}
                >
                    MyTube
                </Typography>

                {/* Search Bar */}
                <Box component='form' onSubmit={handleSearch}
                    sx={{ display: 'flex', mx: 'auto', width: '40%' }}>
                    <InputBase
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            bgcolor: 'background.default',
                            px: 2, py: 0.5, flex: 1,
                            borderRadius: '20px 0 0 20px',
                            color: 'secondary.main',
                        }}
                    />
                    <IconButton type='submit'
                        sx={{ bgcolor: 'background.default', borderRadius: '0 20px 20px 0' }}>
                        <SearchIcon />
                    </IconButton>
                </Box>

                {/* Right Side Buttons */}
                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton color='inherit' onClick={() => navigate('/upload')}>
                            <VideoCallIcon />
                        </IconButton>
                        <Button color='inherit'
                            onClick={() => navigate(`/profile/${user.id}`)}>
                            {user.username}
                        </Button>
                        <Button color='inherit' onClick={logout}>Logout</Button>
                    </Box>
                ) : (
                    <Button variant='outlined' color='secondary'
                        onClick={() => navigate('/login')}>
                        Sign In
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
              }