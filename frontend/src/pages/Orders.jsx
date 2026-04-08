import React, { useEffect, useState, useContext } from 'react'; // Añade useContext
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta según tu proyecto
import api from '../api/axios.js';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState(''); // Estado para el filtro (creada, aprobada, etc.)
    const [expandedOrderId, setExpandedOrderId] = useState(null); // Para mostrar/ocultar detalles
    const [loading, setLoading] = useState(true);
    const [editingDiscount, setEditingDiscount] = useState({ id: null, value: '' });


    // Función para guardar el descuento en el servidor
    const handleUpdateDiscount = async (orderId) => {
        try {
            const newValue = parseFloat(editingDiscount.value);
            if (isNaN(newValue) || newValue < 0) {
                alert("Por favor, ingresa un descuento válido");
                return;
            }

            await api.patch(`/sales/orders/${orderId}/`, { discount: newValue });
            setEditingDiscount({ id: null, value: '' });
            fetchOrders(); // Recargar la lista para ver el final_price actualizado
        } catch (err) {
            console.error("Error al actualizar descuento", err);
            alert("No se pudo actualizar el descuento");
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Si hay filtro, lo añadimos como query param
            const params = filter ? { status: filter } : {};
            const res = await api.get('/sales/orders/', { params });
            
            // Manejo de paginación o lista simple
            setOrders(res.data.results || res.data);
        } catch (err) {
            console.error("Error al cargar órdenes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filter]); // Se recarga cada vez que el usuario cambia el filtro

    const toggleOrder = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    if (loading) return <div className="p-10 text-center font-semibold">Cargando tus pedidos...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-extrabold text-gray-800">Mis Pedidos</h1>
                
                {/* SELECT PARA FILTRAR */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">Filtrar por:</label>
                    <select 
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="creada">Creadas</option>
                        <option value="aprobada">Aprobadas</option>
                        <option value="pagada">Pagadas</option>
                        <option value="anulada">Canceladas</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed rounded-xl p-10 text-center text-gray-500">
                        No se encontraron pedidos con este estado.
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all overflow-hidden">
                            {/* CABECERA: Resumen de la Orden */}
                            <div 
                                onClick={() => toggleOrder(order.id)}
                                className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex gap-4 items-center">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-lg font-bold text-sm">
                                        #{order.id}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                                        <p className="font-semibold text-gray-700 capitalize">{order.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900">${order.total_price}</p>
                                    <p className="text-xs text-blue-500 font-medium">
                                        {expandedOrderId === order.id ? 'Ocultar detalles ▲' : 'Ver detalles ▼'}
                                    </p>
                                </div>
                            </div>

                            {/* DETALLE: Lista de items (Solo si está expandido) */}
                            {expandedOrderId === order.id && (


                                <div className="bg-gray-50 p-5 border-t border-gray-100 animate-in fade-in duration-300">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b">
                                                    <th className="pb-2">Producto</th>
                                                    <th className="pb-2 text-center">Cant.</th>
                                                    <th className="pb-2 text-right">Unitario</th>
                                                    <th className="pb-2 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {order.items.map(item => (
                                                    <tr key={item.id} className="text-sm text-gray-700">
                                                        <td className="py-3 font-medium">{item.product_name}</td>
                                                        <td className="py-3 text-center">{item.quantity}</td>
                                                        <td className="py-3 text-right">${item.price}</td>
                                                        <td className="py-3 text-right font-medium">
                                                            ${(item.quantity * item.price).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* RESUMEN DE PRECIOS */}
                                        <div className="mt-4 flex flex-col items-end border-t pt-4 space-y-2">
                                            <div className="flex justify-between w-full max-w-[200px] text-sm text-gray-600">
                                                <span>Subtotal:</span>
                                                <span>${order.total_price}</span>
                                            </div>
                                            
                                            <div className="flex justify-between w-full max-w-[200px] text-sm text-gray-600">
                                                <span>Descuento:</span>
                                                
                                                {/* SI ES ADMIN Y ESTÁ CREADA: Mostrar input */}
                                                {user?.is_staff && order.status === 'creada' ? (
                                                    <div className="flex gap-2 items-center">
                                                        <input 
                                                            type="number" 
                                                            step="0.01"
                                                            className="w-20 border rounded px-1 text-right text-red-600 font-medium"
                                                            value={editingDiscount.id === order.id ? editingDiscount.value : order.discount}
                                                            onChange={(e) => setEditingDiscount({ id: order.id, value: e.target.value })}
                                                        />
                                                        {editingDiscount.id === order.id && (
                                                            <button 
                                                                onClick={() => handleUpdateDiscount(order.id)}
                                                                className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                                                            >
                                                                Aplicar
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    /* SI NO ES ADMIN: Mostrar solo el texto */
                                                    <span className="text-red-600 font-medium">-${order.discount}..</span>
                                                )}
                                            </div>                        

                                            <div className="flex justify-between w-full max-w-[200px] text-lg font-bold text-gray-900 border-t pt-2">
                                                <span>Total:</span>
                                                <span>${order.final_price}</span>
                                            </div>
                                        </div>
                                    </div>

                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;