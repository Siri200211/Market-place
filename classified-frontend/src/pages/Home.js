import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', location: '' });

  useEffect(() => {
    axios.get('/api/categories.php').then(r => setCategories(r.data));
    axios.get('/api/locations.php').then(r => setLocations(r.data));
    loadAds();
  }, [filters]);

  const loadAds = () => {
    axios.get('/api/ads/index.php', { params: filters })
      .then(res => setAds(res.data.ads));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex flex-wrap gap-4">
        <input type="text" placeholder="What are you looking for?" className="border p-3 rounded flex-1 min-w-64"
          onChange={e => setFilters({...filters, search: e.target.value})} />
        <select className="border p-3 rounded min-w-48" onChange={e => setFilters({...filters, category: e.target.value})}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="border p-3 rounded min-w-48" onChange={e => setFilters({...filters, location: e.target.value})}>
          <option value="">All Locations</option>
          {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ads.map(ad => (
          <Link to={`/ad/${ad.id}`} key={ad.id} className="bg-white rounded-lg shadow hover:shadow-2xl transition">
            {ad.first_photo ? (
              <img src={`http://localhost/classified-app-backend/${ad.first_photo}`} alt={ad.title} className="w-full h-48 object-cover rounded-t-lg" />
            ) : (
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg line-clamp-2">{ad.title}</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">Rs {Number(ad.price).toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">{ad.location_name} • {ad.category_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}