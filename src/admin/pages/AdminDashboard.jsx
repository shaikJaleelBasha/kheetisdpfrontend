import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import '../pages/css/AdminDashboard.css'; // Custom CSS for styling

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verify session and fetch initial data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expired. Please log in again.');
      navigate('/admin/login');
    } else {
      fetchFarmers();
    }
  }, [navigate]);

  // Fetch all farmers
  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/farmers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFarmers(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch farmers:', errorData.message);
        setError(errorData.message);
      }
    } catch (error) {
      console.error('Error fetching farmers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Approve a farmer
  const handleApprove = async (farmerId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/admin/farmers/approve/${farmerId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Farmer approved successfully!');
        setFarmers((prevFarmers) =>
          prevFarmers.map((farmer) =>
            farmer.id === farmerId ? { ...farmer, isApproved: true } : farmer
          )
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to approve farmer:', errorData.message);
        alert('Failed to approve farmer. Please try again.');
      }
    } catch (error) {
      console.error('Error approving farmer:', error);
      alert('Error approving farmer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a farmer
  const handleDelete = async (farmerId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/admin/farmers/${farmerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Farmer deleted successfully!');
        setFarmers((prevFarmers) => prevFarmers.filter((farmer) => farmer.id !== farmerId));
      } else {
        const errorData = await response.json();
        console.error('Failed to delete farmer:', errorData.message);
        alert('Failed to delete farmer. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting farmer:', error);
      alert('Error deleting farmer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch details for a specific farmer
  const fetchFarmerDetails = async (farmerId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/admin/farmers/${farmerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedFarmer(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch farmer details:', errorData.message);
        alert('Failed to fetch farmer details.');
      }
    } catch (error) {
      console.error('Error fetching farmer details:', error);
      alert('Error fetching farmer details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for a specific farmer
  const fetchFarmerProducts = async (farmerId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/farmers/${farmerId}/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch products:', errorData.message);
        alert('Failed to fetch products.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Loading...</p>}
        <table className="farmer-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => (
              <tr key={farmer.id}>
                <td>{farmer.username || 'N/A'}</td>
                <td>{farmer.email || 'N/A'}</td>
                <td>{farmer.phoneNumber || 'N/A'}</td>
                <td>{farmer.isApproved ? 'Approved' : 'Pending'}</td>
                <td>
                  {!farmer.isApproved && (
                    <button onClick={() => handleApprove(farmer.id)} className="btn-approve">
                      Approve
                    </button>
                  )}
                  <button onClick={() => handleDelete(farmer.id)} className="btn-delete">
                    Delete
                  </button>
                  <button onClick={() => fetchFarmerDetails(farmer.id)} className="btn-profile">
                    See Profile
                  </button>
                  <button onClick={() => fetchFarmerProducts(farmer.id)} className="btn-products">
                    View Products
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedFarmer && (
          <div className="farmer-profile">
            <h2>Farmer Profile</h2>
            <p>Name: {selectedFarmer.username}</p>
            <p>Email: {selectedFarmer.email}</p>
            <p>Phone Number: {selectedFarmer.phoneNumber}</p>
            <p>Status: {selectedFarmer.isApproved ? 'Approved' : 'Pending'}</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="farmer-products">
            <h2>Farmer&apos;s Products</h2>
            <ul>
              {products.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
