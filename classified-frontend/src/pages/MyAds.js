import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function MyAds() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios.get('/api/ads/my.php').then(r => setAds(r.data));
  }, []);

 const deleteAd = (id) => {
  if (window.confirm('Are you sure you want to delete this ad?')) {
    axios.delete('/api/ads/delete.php', { data: { id } })
      .then(() => {
        setAds(ads.filter(a => a.id !== id));
        alert('Ad deleted successfully');
      })
      .catch(() => alert('Error deleting ad'));
  }
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Ads</h1>
      {ads.length === 0 ? (
        <p>No ads yet. <Link to="/post" className="text-blue-600">Post one now!</Link></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ads.map(ad => (
            <div key={ad.id} className="bg-white rounded-lg shadow p-4">
              {ad.first_photo && <img src={`http://localhost/classified-app-backend/${ad.first_photo}`} alt="" className="w-full h-48 object-cover rounded" />}
              <h3 className="font-bold text-lg mt-3">{ad.title}</h3>
              <p className="text-2xl font-bold text-green-600">Rs {Number(ad.price).toLocaleString()}</p>
              <button onClick={() => deleteAd(ad.id)} className="mt-3 text-red-600">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}