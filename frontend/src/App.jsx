import { Routes, Route, Link } from 'react-router-dom';
import ProductDetail from './pages/ProductDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar'; // <-- Importamos el nuevo que creamos
import CartPage from './pages/CartPage';   // <-- La crearemos luego
import Login from './pages/Login';
import Orders from './pages/Orders';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Usamos el componente Navbar profesional que tiene el contador */}
      <Navbar /> 

      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* IMPORTANTE: Asegúrate de que este path coincida con tus <Link> */}
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;