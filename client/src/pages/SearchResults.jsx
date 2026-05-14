
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await API.get('/videos', { params: { search: query } });
                setResults(res.data);
            } catch (err) {
                console.error(err);
                setResults([]);
            }
            setLoading(false);
        };

        if (query.trim()) {
            fetchResults();
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <Box sx={{ mt: 4, px: 3, py: 2 }}>
            <Typography variant='h4' gutterBottom>
                Search results for "{query}"
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : query.trim() === '' ? (
                <Typography color='text.secondary'>Please enter a search term.</Typography>
            ) : results.length === 0 ? (
                <Typography color='text.secondary'>No videos found for this search.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {results.map((video) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={video._id || video.id}>
                            <VideoCard video={video} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default SearchResults;
