import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/NavBar';
import '../pages/css/ProfilePage.css';

const ProfilePage = () => {
  const { userId } = useParams(); // Get userId from route parameters
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/profile`);
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
      } else {
        setError('Failed to fetch user profile.');
      }
    } catch (err) {
      setError('An error occurred while fetching profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        {loading ? (
          <p>Loading profile...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="profile-details">
            <h1>Profile</h1>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Phone:</strong> {userDetails.phone}</p>
            <p><strong>Address:</strong> {userDetails.address}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
