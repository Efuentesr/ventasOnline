import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const result = await login(username, password);
      if (result.success) {
          navigate('/'); // Volver al inicio tras loguearse
      } else {
          alert(result.error);
      }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-indigo-600">Iniciar Sesión</h2>
                <input 
                    type="text" placeholder="Usuario" 
                    className="w-full p-3 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="password" placeholder="Contraseña" 
                    className="w-full p-3 mb-6 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;