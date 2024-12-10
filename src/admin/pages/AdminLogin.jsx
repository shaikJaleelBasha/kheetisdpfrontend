import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/AdminLogin.css'; // Add custom styling here

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();

        // Store session token and admin ID in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('adminId', data.adminId);

        setErrorMessage('');
        navigate('/admin/dashboard'); // Redirect to admin dashboard
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className="admin-login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="register-link">
          New user? <a href="/admin-signup">Register Here</a>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;