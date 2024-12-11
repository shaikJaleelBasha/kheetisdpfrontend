import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../pages/css/OrderPage.css'

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${userId}`);
      const data = await response.json();
      setOrders(data);
    } catch {
      alert('Failed to fetch orders.');
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Your Orders</h1>
      {orders.length === 0 ? <p>No orders found.</p> : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>{order.productId}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
