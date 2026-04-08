import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Home() { // Cambié App por Home para ser consistentes
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  
  // --- NUEVOS ESTADOS PARA PAGINACIÓN ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Agregamos el parámetro ?page= a la consulta
    api.get(`/products/items/?page=${page}`)
      .then(res => {
        // Django devuelve res.data.results cuando hay paginación
        const data = res.data.results || res.data; 
        setProducts(data);
        
        // Calculamos total de páginas (asumiendo PAGE_SIZE: 12 en Django)
        if (res.data.count) {
          setTotalPages(Math.ceil(res.data.count / 12));
        }
        setLoading(false);
        window.scrollTo(0, 0); // Sube al inicio al cambiar de página
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [page]); // Se ejecuta cada vez que cambia la página

  const filteredProducts = products.filter(p => {
    const name = p.name ? p.name.toLowerCase() : '';
    const code = p.code ? p.code.toLowerCase() : '';
    const searchTerm = search.toLowerCase();
    return name.includes(searchTerm) || code.includes(searchTerm);
  });

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-indigo-600 mb-8 text-center">
        Mi Tienda de Joyas y Scrapbook
      </h1>

      <div className="max-w-md mx-auto mb-10">
        <input 
          type="text"
          placeholder="Busca en esta página..."
          className="w-full px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="text-center p-20 italic text-gray-500">Cargando productos...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                <img 
                  src={product.main_image || 'https://placehold.co/400x400?text=Sin+Foto'} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
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
                      className="w-full mt-4 block text-center bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Ver Detalle
                    </Link>               
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- BOTONES DE PAGINACIÓN --- */}
          <div className="flex justify-center items-center gap-6 mt-12 mb-10">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-2 bg-white border border-gray-300 rounded-full font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Anterior
            </button>

            <span className="text-gray-600 font-bold">
              Página <span className="text-indigo-600">{page}</span> de {totalPages}
            </span>

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-2 bg-white border border-gray-300 rounded-full font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;