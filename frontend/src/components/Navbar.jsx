import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos el hook de auth
import { useCart } from '../context/CartContext'; // Para mostrar cuántos items hay

const Navbar = () => {
  const { user, logout } = useAuth(); // Sacamos los datos del usuario y la función logout
  const { cart } = useCart();

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
          ARTESA<span className="text-gray-900">&SCRAP</span>
        </Link>

        {/* Links de navegación */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">
            Catálogo
          </Link>

          <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 font-medium">
            Carrito
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            // Si el usuario ESTÁ logueado
            <>
            <Link 
              to="/orders" className="relative text-gray-600 hover:text-indigo-600 font-medium">
              Ordenes
            </Link>
            </>
          ) : (
            // Si el usuario NO está logueado
            <></>
          )}


          {/* --- LÓGICA DE LOGIN / LOGOUT --- */}
          <div className="border-l pl-6 flex items-center gap-4">
            {user ? (
              // Si el usuario ESTÁ logueado
              <>
                <span className="text-sm text-gray-500 hidden md:block">
                  ¡Hola, <span className="font-bold text-gray-800">Artesano</span>!
                </span>
                <button 
                  onClick={logout}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
                >
                  Salir
                </button>
              </>
            ) : (
              // Si el usuario NO está logueado
              <Link 
                to="/login" 
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;