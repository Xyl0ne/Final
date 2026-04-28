
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useEffect, useState } from "react"; // Hooks come from 'react'
import { useSearchParams } from "react-router-dom"; // Navigation comes from 'react-router-dom'

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const res = await API.get('/videos', { params: { search: query } });
            setResults(res.data);
        };
        if (query) fetchResults();
    }, [query]);

    return (
        <div className="video-grid">
            {results.map(video => <VideoCard key={video.id} video={video} />)}
        </div>
    );
};

export default SearchResults 