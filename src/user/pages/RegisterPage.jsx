import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import './css/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Check email availability before submitting the form
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/check-email?email=${email}`);
      const data = await response.json();
      return data.exists;
    } catch (err) {
      setError('Error checking email availability. Please try again later.');
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if email already exists
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      setError('Email is already taken. Please use a different one.');
      return; // Stop the form submission if email exists
    }

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...');
        setFormData({ username: '', fullName: '', email: '', password: '' });

        // Redirect to login after 2 seconds
        setTimeout(() => navigate('/user-login'), 2000);
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while registering. Please try again later.');
    }
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {/* Error and Success Messages */}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </div>

        {/* Full Name Field */}
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Enter your password"
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Register</button>
      </form>

      {/* Link to Login Page */}
      <p>
        Already have an account? <Link to="/user-login" className="login-link">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
