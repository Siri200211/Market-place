import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PostAd from './pages/PostAd';
import MyAds from './pages/MyAds';
import AdDetail from './pages/AdDetail';
import Login from './components/Login';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost/classified-app-backend';
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/auth/me.php')
      .then(res => res.data.loggedIn && setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold">LankaAds</Link>
            <nav className="space-x-6">
              <Link to="/" className="hover:underline">Home</Link>
              {user ? (
                <>
                  <Link to="/post" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">Post Free Ad</Link>
                  <Link to="/my" className="hover:underline">My Ads</Link>
                  <span>Hello, {user.name.split(' ')[0]}!</span>
                  <button 
  onClick={() => {
    fetch('http://localhost/classified-app-backend/api/auth/google.php', { method: 'DELETE', credentials: 'include' });
    setUser(null);
    window.location.reload();
  }} 
  className="text-sm underline ml-4"
>
  Logout
</button>
                </>
              ) : (
                <Login setUser={setUser} />
              )}
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/ad/:id" element={<AdDetail />} />
          <Route path="/post" element={user ? <PostAd user={user} /> : <Home />} />
          <Route path="/my" element={user ? <MyAds /> : <Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;