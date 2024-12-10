import { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import '../pages/css/CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
        calculateTotalPrice(data);
      } else {
        alert('Failed to fetch cart items.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching cart items.');
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });

      if (response.ok) {
        alert('Product removed from cart.');
        fetchCartItems(); // Refresh the cart
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error removing item from cart.');
    }
  };

  const buyAllItems = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/buy-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userId),
      });

      if (response.ok) {
        alert('Purchase successful! All items bought.');
        setCartItems([]); // Clear cart
        setTotalPrice(0); // Reset total price
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error processing purchase.');
    }
  };

  return (
    <div className="cart">
      <Navbar />
      <div className="cart-container">
        <h1 className="cart-header">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={`http://localhost:8080/${item.product.imageUrl || 'default-image.jpg'}`}
                    alt={item.product.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.product.name}</h3>
                    <p>{item.product.description}</p>
                    <p>Category: {item.product.category}</p>
                    <p>Price: ₹{item.product.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <button
                      className="remove-from-cart-button"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      Remove from Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Total Price: ₹{totalPrice}</h2>
              <button className="buy-all-button" onClick={buyAllItems}>
                Buy All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
