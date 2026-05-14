const History = () => {
    const [history, setHistory] = useState([]);

    const fetchHistory = () => {
        API.get('/history').then(res => setHistory(res.data));
    };

    useEffect(() => { fetchHistory(); }, []);

    const clearHistory = async () => {
        await API.delete('/history');
        setHistory([]); // Local state update
    };

    return (
        <div>
            <button onClick={clearHistory}>Clear History</button>
            <div className="history-list">
                {history.map(video => <VideoCard key={video.id} video={video} />)}
            </div>
        </div>
    );
  };
  export default History