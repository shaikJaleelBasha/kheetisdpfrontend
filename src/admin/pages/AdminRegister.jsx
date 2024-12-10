import { useState } from 'react';
import './css/AdminRegister.css'; // Custom CSS for styling

const AdminRegister = () => {
  const [admin, setAdmin] = useState({
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(admin),
      });

      if (response.ok) {
        setSuccessMessage('Admin account created successfully!');
        setAdmin({ email: '', phoneNumber: '', password: '' });
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to create admin account.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className="admin-signup-container">
      <h2>Admin Signup</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className="admin-signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={admin.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={admin.phoneNumber}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={admin.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="signup-btn">
          Sign Up
        </button>

        <p className="login-link">
          Already have an account? <a href="/admin-login">Login Here</a>
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;