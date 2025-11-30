import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PostAd({ user }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios.get('/api/categories.php').then(r => setCategories(r.data));
    axios.get('/api/locations.php').then(r => setLocations(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Append photos
    photos.forEach((file, i) => {
      formData.append('photos[]', file);
    });

    try {
      await axios.post('/api/ads/create.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Ad posted successfully!');
      navigate('/my');
    } catch (err) {
      alert('Error posting ad');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Post a Free Ad</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <input name="title" required placeholder="Title" className="w-full border p-3 rounded" />
        <textarea name="description" required placeholder="Description" rows="5" className="w-full border p-3 rounded"></textarea>
        <input name="price" type="number" required placeholder="Price (Rs)" className="w-full border p-3 rounded" />
        
        <select name="category_id" required className="w-full border p-3 rounded">
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>

        <select name="location_id" required className="w-full border p-3 rounded">
          <option value="">Select Location</option>
          {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
        </select>

        <div>
          <label className="block font-medium mb-2">Photos (max 5)</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setPhotos(Array.from(e.target.files).slice(0,5))} className="w-full" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-700">
          POST YOUR AD
        </button>
      </form>
    </div>
  );
}