import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null); // Empezamos en null
  const [mainImage, setMainImage] = useState(null);
  const { addToCart } = useCart();


  useEffect(() => {
    api.get(`/products/items/${id}/`)
      .then(res => {
        const data = res.data;
        setProduct(data);
        
        // Lógica de imagen: Priorizar la 'featured'
        if (data.images && data.images.length > 0) {
          const featured = data.images.find(img => img.is_feature === true);
          setMainImage(featured || data.images[0]); // Si no hay featured, la primera
        }
      })
      .catch(err => console.error("Error:", err));
  }, [id]);

  // --- ESTO ES LO QUE ESTABA FALLANDO ---
  // Si product es null, mostramos un cargando y NO dejamos pasar al resto del código
  if (!product) {
    return <div className="p-20 text-center font-bold">Cargando producto...</div>;
  }
  // Si llegamos aquí, el console.log SÍ se va a ejecutar porque product ya existe
  console.log("Producto cargado con éxito:", product);

  const handleAddToCart = () => {
    // Ahora estamos SEGUROS de que product tiene nombre y precio
    const itemParaElCarrito = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      main_image: mainImage?.image || product.images[0]?.image,
      quantity: 1
    };
    
    addToCart(itemParaElCarrito);
    alert(`Añadido: ${product.name}`); // Confirmación rápida
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Link to="/" className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block font-medium">
        ← Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-gray-100">
        
        {/* COLUMNA IZQUIERDA: GALERÍA DE CONSULTA */}
        <div className="space-y-6">
          {/* Visor Principal */}
          <div className="aspect-square rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden group">

            <img 
                src={mainImage?.image || 'https://placehold.co/600x600?text=Sin+Imagen'}
                alt={mainImage?.alt_text || product?.name || "Producto"}
                className="w-full h-full object-contain p-4"
                onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=Error+al+cargar'; }}
            />

          </div>

          {/* Miniaturas de consulta */}
          <div className="flex gap-4 mt-6 overflow-x-auto">
            {product.images?.map((img) => (
                <button
                    key={img.id}
                    onClick={() => setMainImage(img)} // Solo cambia al hacer CLICK
                    onMouseEnter={() => setMainImage(img)}
                    className={`min-w-[80px] h-20 rounded-xl border-2 overflow-hidden ${
                        mainImage?.id === img.id ? 'border-indigo-600' : 'border-transparent'
                    }`}
                >
                    <img 
                        src={img.image} // Aquí también, directo sin prefijos
                        className="w-full h-full object-cover" 
                        alt="Miniatura"
                    />
                </button>
            ))}

          </div>
        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN Y COMPRA */}
        <div className="flex flex-col justify-center">
          <nav className="flex mb-4 text-xs font-bold uppercase tracking-widest text-indigo-500">
            <span>{product.category_name}</span>
          </nav>
          
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-2">
            {product.name}
          </h1>
          <p className="text-gray-400 font-mono text-sm mb-8">REF: {product.code}</p>

          <div className="prose prose-indigo text-gray-600 mb-10">
            <p className="text-lg leading-relaxed">
              {product.description || "Esta pieza artesanal destaca por su acabado detallado y materiales seleccionados, ideal para coleccionistas o como un regalo inolvidable."}
            </p>
          </div>

          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-sm text-gray-400 block mb-1">Precio Unitario</span>
              <span className="text-5xl font-black text-gray-900">${product.price}</span>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
                product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
              </span>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-5 rounded-2xl font-bold text-xl transition-all shadow-xl ${
              product.stock > 0 
              ? 'bg-gray-900 text-white hover:bg-indigo-600 shadow-indigo-100' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado' }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;