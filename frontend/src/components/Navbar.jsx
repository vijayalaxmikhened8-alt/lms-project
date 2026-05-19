import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const { cart, removeFromCart, clearCart } = useCart();
    const [isCartOpen, setIsCartOpen] = React.useState(false);
    const [isEnrolling, setIsEnrolling] = React.useState(false);

    const userId = localStorage.getItem('userId');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                                <BookOpen className="h-8 w-8 text-blue-600" />
                            </motion.div>
                            <span className="font-extrabold text-2xl text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">LearnSpace</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/courses" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">
                            Explore Courses
                        </Link>

                        {/* Cart Icon */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsCartOpen(!isCartOpen)} 
                                className="p-2 text-slate-600 hover:text-blue-600 transition-colors relative"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {cart.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce shadow-sm">
                                        {cart.length}
                                    </span>
                                )}
                            </button>

                            {/* Cart Dropdown */}
                            <AnimatePresence>
                                {isCartOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                                    >
                                        <div className="p-4 bg-slate-50 border-b border-slate-100">
                                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                                <ShoppingCart className="w-4 h-4" /> Your Cart
                                            </h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto p-2">
                                            {cart.length === 0 ? (
                                                <p className="text-center text-slate-500 py-6 font-medium text-sm">Your cart is empty.</p>
                                            ) : (
                                                cart.map(item => (
                                                    <div key={item.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                                        <div>
                                                            <p className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</p>
                                                            <p className="text-xs text-blue-600 font-semibold">Free</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-red-400 hover:text-red-600 text-xs font-bold px-2 py-1 bg-red-50 rounded-md"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {cart.length > 0 && (
                                            <div className="p-4 border-t border-slate-100">
                                                <button 
                                                    disabled={isEnrolling}
                                                    onClick={async () => { 
                                                        if (!userId) {
                                                            navigate('/auth');
                                                            setIsCartOpen(false);
                                                            return;
                                                        }
                                                        setIsEnrolling(true);
                                                        try {
                                                            // Enroll in all courses in cart
                                                            await Promise.all(cart.map(item => 
                                                                api.post(`/courses/${item.id}/enroll`, { user_id: userId }).catch(err => {
                                                                    // Ignore 400 errors which mean "already enrolled"
                                                                    if (err.response && err.response.status === 400) {
                                                                        return Promise.resolve();
                                                                    }
                                                                    throw err;
                                                                })
                                                            ));
                                                            clearCart();
                                                            setIsCartOpen(false);
                                                            navigate('/dashboard');
                                                        } catch (err) {
                                                            console.error("Error during checkout:", err);
                                                            alert("There was an issue enrolling in your courses.");
                                                        }
                                                        setIsEnrolling(false);
                                                    }} 
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {isEnrolling ? 'Processing...' : 'Proceed to Enroll'}
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {token ? (
                            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                                <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-semibold transition-colors bg-slate-50 hover:bg-red-50 px-4 py-2 rounded-xl"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                                <Link to="/auth" className="text-slate-600 hover:text-blue-600 font-semibold transition-colors">
                                    Log in
                                </Link>
                                <Link to="/auth?signup=true" className="bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
