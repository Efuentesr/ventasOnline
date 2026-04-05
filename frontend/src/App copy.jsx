import { Routes, Route, Link } from 'react-router-dom';
import ProductDetail from './pages/ProductDetail';
import Home from './pages/Home'; // <-- Mueve tu lógica actual de la lista aquí

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar simplificado */}
      <nav className="p-6 bg-white border-b mb-6">
        <Link to="/" className="text-2xl font-black text-indigo-600">ARTESA & SCRAP</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}

export default App;