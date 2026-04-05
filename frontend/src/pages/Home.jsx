import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function App() {
  const [products, setProducts] = useState([]);

  // 1. Añade este nuevo estado al inicio de la función App:
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => {
    const name = p.name ? p.name.toLowerCase() : '';
    const code = p.code ? p.code.toLowerCase() : '';
    const searchTerm = search.toLowerCase();
    
    return name.includes(searchTerm) || code.includes(searchTerm);
  });

  useEffect(() => {
    api.get('/products/items/')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setProducts(data || []);
      })
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-600 mb-8 text-center">
        Mi Tienda de Joyas y Scrapbook
      </h1>

      {/* 3. En el return, antes del grid, añade el input: */}
      <div className="max-w-md mx-auto mb-10">
        <input 
          type="text"
          placeholder="Busca joyas, kits de scrap o códigos..."
          className="w-full px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      {/* Grid de prueba con Tailwind */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {filteredProducts.map(product => (

          // Dentro de tu products.map(...)
          <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            {/* Contenedor de Imagen (Placeholder con color según categoría) */}

            <img 
                src={product.main_image || 'https://placehold.co/400x400?text=Sin+Foto'} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

            <div className="p-5 flex-grow">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-600">
                  {product.category}
                </span>
                <span className="text-gray-400 text-xs font-mono">{product.code}</span>
              </div>
              
              <h3 className="text-gray-800 font-semibold text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                {product.name}
              </h3>
              
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {product.description || 'Artesanía de alta calidad diseñada exclusivamente para ti.'}
              </p>
            </div>

            <div className="p-5 pt-0 mt-auto">
              <div className="flex-col items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                <Link 
                    to={`/product/${product.id}`} 
                    className="w-full mt-4 block text-center bg-indigo-600 text-white py-2 rounded-lg font-semibold"
                >
                    Ver Detalle
                </Link>               
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center p-20">
          <p className="text-gray-500 italic">Conectando con el servidor de Django...</p>
        </div>
      )}
    </div>
  );
}

export default App;