import { Link } from 'react-router-dom'; // Import Link for navigation
import '../pages/css/AdminNavbar.css'; // Assuming the CSS file is named AdminNavbar.css

const AdminNavbar = () => {
  const handleLogout = () => {
    // Clear session storage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('adminId');
    window.location.href = '/admin-login'; // Redirect to login page
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">KHEETI Admin</h1>
      <div className="navbar-links">
        <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/admin/manage-farmers" className="navbar-link">Manage Farmers</Link>
        <Link to="/admin/reports" className="navbar-link">Reports</Link>
        <button className="navbar-link logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
