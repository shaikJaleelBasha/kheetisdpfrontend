import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Assume role is saved in localStorage

  // If there's no token, the user is not logged in
  if (!token) {
    alert('Session expired. Please log in again.');
    return <Navigate to="/user-login" />;
  }

  // If the role is provided, check that the user has the correct role
  if (role && userRole !== role) {
    alert('Access denied. Insufficient permissions.');
    return <Navigate to="/" />;
  }

  // If the user is logged in and role matches (if provided), show the page
  return children;
};

// PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string, // Optional: to validate the role if passed
};

export default ProtectedRoute;
