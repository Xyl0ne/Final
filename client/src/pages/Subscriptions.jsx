const Subscriptions = () => {
        const [videos, setVideos] = useState([]);

    useEffect(() => {
        API.get('/users/feed/subscriptions').then(res => setVideos(res.data));
    }, []);

    return (
        <div>
            {videos.length > 0 ? (
                <div className="video-grid">
                    {videos.map(v => <VideoCard key={v.id} video={v} />)}
                </div>
            ) : (
                <p>You haven't subscribed to anyone yet!</p>
            )}
        </div>
    );
  };

export default Subscriptions;