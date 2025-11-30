import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AdDetail() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    axios.get(`/api/ads/single.php?id=${id}`).then(r => setAd(r.data));
  }, [id]);

  if (!ad) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          {ad.photos?.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {ad.photos.map((p, i) => (
                <img key={i} src={`http://localhost/classified-app-backend/${p.photo_path}`} alt="" className="w-full rounded-lg" />
              ))}
            </div>
          ) : <div className="bg-gray-200 h-96 rounded-lg"></div>}
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{ad.title}</h1>
          <p className="text-5xl font-bold text-green-600 mb-6">Rs {Number(ad.price).toLocaleString()}</p>
          <p className="text-gray-700 mb-6">{ad.description}</p>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Location:</strong> {ad.location_name}</p>
            <p><strong>Category:</strong> {ad.category_name}</p>
            <p><strong>Seller:</strong> {ad.seller_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}