import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../pages/css/NavBar.css'; // Assuming the CSS file is in the css folder

const Navbar = () => {
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  // Clear user-related data on logout
  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">KHEETI</h1>
      <div className="navbar-links">
        {userId && (
          <>
            <Link to={`/home/${userId}`} className="navbar-link">Home</Link>
            <Link to={`/cart/${userId}`} className="navbar-link">Cart</Link>
            <Link to={`/profile/${userId}`} className="navbar-link">Profile</Link>
            <Link to={`/buy/${userId}`} className="navbar-link">Buy Product</Link>
          </>
        )}
        <Link to="/user-login" className="navbar-link" onClick={handleLogout}>Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
