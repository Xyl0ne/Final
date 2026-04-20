import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import History from './pages/History';
import Subscriptions from './pages/Subscriptions';
import SearchResults from './pages/SearchResults';
import Box from '@mui/material/Box';

function App() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ pt: 8 }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/watch/:id' element={<Watch />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/history' element={<History />} />
          <Route path='/subscriptions' element={<Subscriptions />} />
          <Route path='/search' element={<SearchResults />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
