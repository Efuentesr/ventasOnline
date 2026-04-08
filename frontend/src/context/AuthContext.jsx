// AuthContext.jsx actualizado
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para obtener datos del usuario
    const fetchUserProfile = async () => {
        try {
            const res = await api.get('/user/profile/');
            setUser(res.data); // Guarda { username, is_staff }
        } catch (error) {
            console.error("Error obteniendo perfil", error);
            logout();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUserProfile().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.post('/token/', { username, password });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            
            // 1. Obtenemos el perfil completo inmediatamente después del login
            const profileRes = await api.get('/user/profile/');
            
            // 2. Sincronización del carrito (tu lógica anterior...)
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (localCart.length > 0) {
                await api.post('/sales/sync-cart/', { 
                    items: localCart.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity || 1
                    }))
                });
            }

            setUser(profileRes.data); // Ahora user tiene .is_staff
            return { success: true };
        } catch (error) {
            console.error("Error de login", error);
            return { success: false, error: "Credenciales inválidas" };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('cart');
        setUser(null);
        window.location.href = '/login'; 
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);