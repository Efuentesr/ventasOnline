import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Importamos el contexto que crearemos

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              ART<span className="text-indigo-600">STORE</span>
            </span>
          </Link>

          {/* NAVEGACIÓN CENTRAL (Opcional) */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Catálogo</Link>
            <Link to="/?category=scrapbooking" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Scrapbooking</Link>
          </div>

          {/* ICONOS DERECHA */}
          <div className="flex items-center gap-5">
            {/* CARRITO */}
            <Link to="/cart" className="relative group p-2 rounded-full hover:bg-gray-50 transition-all">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-7 w-7 text-gray-700 group-hover:text-indigo-600" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 118 0m-4 8l2-2m0 0l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>

              {/* Burbuja del contador */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* BOTÓN PERFIL (Opcional) */}
            <button className="hidden sm:block bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all">
              Mi Cuenta
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;