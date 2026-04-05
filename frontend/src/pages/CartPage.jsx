import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, cartTotal, removeFromCart, clearCart, updateQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8">Tu Carrito</h1>
      <div className="bg-white rounded-3xl shadow-sm border p-6">
        {cart.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center justify-between border-b py-4 last:border-0">
            <div className="flex items-center gap-4">
              <img 
                // Intentamos usar la imagen guardada, si no la principal, si no el placeholder
                src={item.image_to_show || item.main_image || 'https://placehold.co/100x100?text=Sin+Foto'} 
                alt={item.name} 
                className="w-20 h-20 object-cover rounded-2xl border bg-gray-50 shadow-sm"
                onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Error'; }}
              />
              <div>

                <h3 className="font-bold text-gray-900">
                {item.name || "Producto sin nombre"} 
                </h3>

                {/*}
                <p className="text-gray-500 font-medium">${item.price} x {item.quantity}</p>
                */}

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 bg-gray-50 border rounded-xl p-1 w-fit">
                        <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 font-black"
                        >
                        –
                        </button>
                        
                        <span className="w-6 text-center font-bold text-gray-900 text-sm">
                        {item.quantity}
                        </span>
                        
                        <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600 font-black"
                        >
                        +
                        </button>
                    </div>
                    
                    <p className="text-xs text-gray-400 font-medium">
                        Precio unitario: ${item.price}
                    </p>
                </div>

                {/* Subtotal del item a la derecha */}
                <div className="text-right">
                <p className="font-black text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                </p>
                </div>


              </div>
            </div>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              Eliminar
            </button>
          </div>
        ))}
        
        <div className="mt-8 pt-6 border-t flex justify-between items-end">
          <div>
            <button onClick={clearCart} className="text-gray-400 text-sm hover:text-red-500">Vaciar carrito</button>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Total a pagar:</p>
            <p className="text-4xl font-black text-indigo-600">${cartTotal.toFixed(2)}</p>
            <button className="mt-4 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all w-full">
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;