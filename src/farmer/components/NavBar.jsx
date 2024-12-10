import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../pages/css/NavBar.css'; // Assuming the CSS file is in the css folder

const Navbar = () => {
  const farmerId = localStorage.getItem('farmerId'); // Retrieve farmerId from localStorage

  // Clear farmer-related data on logout
  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-brand">KHEETI</h1>
      <div className="navbar-links">
        {farmerId && (
          <>
            <Link to={`/farmers/products/${farmerId}`} className="navbar-link">Home</Link>
            <Link to={`/farmers/${farmerId}/add-product`} className="navbar-link">Add Product</Link>
            <Link to={`/farmers/${farmerId}/profile`} className="navbar-link">Profile</Link>
            <Link to={`/farmers/${farmerId}/sold-products`} className="navbar-link">Sold Products</Link>
          </>
        )}
        <Link to="/farmer-login" className="navbar-link" onClick={handleLogout}>Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
