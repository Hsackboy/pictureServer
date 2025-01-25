'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function ImageUploader() {
  const [image, setImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedImage(response.data.filename);
      setError('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Failed to upload image.');
      } else {
        setError('Failed to connect to the server.');
      }
    }
  };

  const handleRetrieve = async () => {
    if (!uploadedImage) {
      setError('No uploaded image to retrieve.');
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:5000/image/${uploadedImage}`, {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(response.data);
      setUploadedImage(imageUrl);
      setError('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Failed to retrieve image.');
      } else {
        setError('Failed to connect to the server.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Image Uploader</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Upload Image
      </button>

      {uploadedImage && (
        <div className="flex flex-col items-center">
          <button
            onClick={handleRetrieve}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            Retrieve Image
          </button>

          {typeof uploadedImage === 'string' && uploadedImage.startsWith('blob') ? (
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="max-w-xs rounded border"
            />
          ) : (
            <p>Uploaded file: {uploadedImage}</p>
          )}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
      <img src='http://127.0.0.1:5000/image/capture_1b8e3daf5d0c8c1544ac722d70152c83.nbcnews-ux-2880-1000-3840044435.jpeg' width={100}></img>
    </div>
  );
}
