import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/NavBar';
import './css/FarmerProfilePage.css';

const FarmerProfilePage = () => {
  const { farmerId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    fullName: '',
    address: '',
    farmSize: '',
    profileImage: null,
    farmImage: null,
  });

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/farmers/${farmerId}/profile`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 404) {
        // No profile found, allow the user to create one
        setProfile(null);
      } else {
        setError('Failed to fetch profile. Please try again.');
      }
    } catch (err) {
      setError('Error fetching profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [farmerId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('firstName', formData.firstName);
    data.append('fullName', formData.fullName);
    data.append('address', formData.address);
    data.append('farmSize', formData.farmSize);
    if (formData.profileImage) data.append('profileImage', formData.profileImage);
    if (formData.farmImage) data.append('farmImage', formData.farmImage);

    try {
      const response = await fetch(`http://localhost:8080/api/farmers/${farmerId}/profile`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setError(null);
        alert('Profile saved successfully!');
      } else {
        setError('Failed to save profile. Please try again.');
      }
    } catch (err) {
      setError('Error saving profile: ' + err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h1>Farmer Profile</h1>
        {profile ? (
          <div className="profile-details">
            <p><strong>First Name:</strong> {profile.firstName}</p>
            <p><strong>Full Name:</strong> {profile.fullName}</p>
            <p><strong>Address:</strong> {profile.address}</p>
            <p><strong>Farm Size:</strong> {profile.farmSize} acres</p>
            <div className="profile-images">
              <img
                src={profile.profileImage ? `data:image/jpeg;base64,${profile.profileImage}` : 'https://via.placeholder.com/150'}
                alt="Profile"
                className="profile-image"
              />
              <img
                src={profile.farmImage ? `data:image/jpeg;base64,${profile.farmImage}` : 'https://via.placeholder.com/150'}
                alt="Farm"
                className="farm-image"
              />
            </div>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Farm Size (in acres)</label>
              <input
                type="number"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Profile Image</label>
              <input type="file" name="profileImage" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Farm Image</label>
              <input type="file" name="farmImage" onChange={handleChange} />
            </div>
            <button type="submit" className="save-button">Save Profile</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FarmerProfilePage;
