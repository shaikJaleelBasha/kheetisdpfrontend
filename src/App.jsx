import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './user/pages/MainPage';
import FarmerRegister from './farmer/pages/FarmerRegister';
import FarmerLogin from './farmer/pages/FarmerLogin';
import FarmerHomePage from './farmer/pages/FarmerHomePage';
import AddProductScreen from './farmer/pages/AddProductScreen';
import FarmerProfilePage from './farmer/pages/FarmerProfilePage';
import SoldProductsPage from './farmer/pages/SoldProductsPage';
import EditProductPage from './farmer/pages/EditProductPage';
import AdminRegister from './admin/pages/AdminRegister';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminLogin from './admin/pages/AdminLogin';
import ProtectedRoute from './ProtectedRoute';
import RegisterPage from './user/pages/RegisterPage';
import LoginPage from './user/pages/LoginPage';
import HomePage from './user/pages/HomePage';
import CartPage from './user/pages/CartPage';
import BuyPage from './user/pages/BuyPage';
import ProfilePage from './user/pages/ProfilePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MainPage />} />
        <Route path="/user-signup" element={<RegisterPage />} />
        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/buy/:productId" element={<BuyPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />

        <Route path="/home/:userId" element={<HomePage />} />
        <Route path="/cart/:userId" element={<CartPage />} />
        <Route path="/farmer-register" element={<FarmerRegister />} />
        <Route path="/farmer-login" element={<FarmerLogin />} />
        <Route path="/farmers/products/:farmerId" element={<FarmerHomePage />} />
        <Route path="/farmers/:farmerId/add-product" element={<AddProductScreen />} />
        <Route path="/farmers/:farmerId/edit-product/:productId" element={<EditProductPage />} />
        <Route path="/farmers/:farmerId/profile" element={<FarmerProfilePage />} />
        <Route path="/farmers/:farmerId/sold-products" element={<SoldProductsPage />} />
        <Route path="/admin-signup" element={<AdminRegister />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
