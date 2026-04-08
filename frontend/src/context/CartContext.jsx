import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext'; // Importamos el auth para saber si hay usuario

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // const { user } = useAuth(); // Obtenemos el estado del usuario
  const auth = useAuth(); // Obtenemos el objeto completo
  const user = auth ? auth.user : null; // Protección por si auth es undefined aún

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar en LocalStorage (siempre, como respaldo)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // FUNCIÓN AUXILIAR: Sincroniza el estado actual con Django
  const syncWithServer = async (currentCart) => {
    // Si no hay usuario o no está logueado, no hacemos nada
    if (!user || !user.loggedIn) return; 

    try {
      await api.post('/sales/sync-cart/', {
        items: currentCart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      });
    } catch (err) {
      console.error("Error sincronizando:", err);
    }
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      let newCart;
      const existingItem = prevCart.find(i => i.id === item.id);
      
      if (existingItem) {
        newCart = prevCart.map(i =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        newCart = [...prevCart, { ...item, quantity: 1, price: parseFloat(item.price) || 0 }];
      }
      
      syncWithServer(newCart); // Avisamos al servidor
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      syncWithServer(newCart); // Avisamos al servidor
      return newCart;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => {
      const newCart = prevCart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      syncWithServer(newCart); // Avisamos al servidor
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      // Opcional: Podrías crear un endpoint en Django para vaciar el carrito 
      // o simplemente enviar una lista vacía a sync-cart
      api.post('/sales/sync-cart/', { items: [] });
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const createOrder = async () => {
      try {
          const orderData = {
              items: cart.map(item => ({
                  product: item.id,
                  quantity: item.quantity
              }))
          };
          const response = await api.post('/sales/orders/', orderData);
          clearCart();
          return { success: true, orderId: response.data.id };
      } catch (error) {
          // LOG CLAVE: Aquí verás qué dice el "debug_error" que pusimos arriba
          console.error("Detalle del error del servidor:", error.response?.data);
          
          const errorMsg = error.response?.data?.debug_error || "Error desconocido";
          return { success: false, error: errorMsg };
      }
  };

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, 
      cartTotal, cartCount, updateQuantity,
      createOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);