import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api'; // Use centralized api

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('signup') === 'true') {
            setIsLogin(false);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (isLogin) {
                const res = await api.post('/auth/login', { email, password });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userRole', res.data.user.role);
                localStorage.setItem('userName', res.data.user.name);
                localStorage.setItem('userId', res.data.user.id);
                navigate('/dashboard');
            } else {
                await api.post('/auth/register', { name, email, password, role });
                setIsLogin(true);
                setError('Registration successful! Please log in.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred connecting to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200/50 rounded-full blur-[100px] -z-10 animate-pulse" style={{animationDelay: '2s'}} />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white"
            >
                <div className="text-center">
                    <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="inline-block">
                        <div className="bg-blue-100 p-4 rounded-2xl">
                            <BookOpen className="mx-auto h-10 w-10 text-blue-600" />
                        </div>
                    </motion.div>
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className="mt-2 text-slate-500 font-medium">
                        {isLogin ? 'Enter your details to access your dashboard.' : 'Start your learning journey today.'}
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl text-sm font-bold shadow-sm ${error.includes('successful') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {error}
                        </motion.div>
                    )}
                    
                    <div className="space-y-5">
                        {!isLogin && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                                <input 
                                    type="text" required 
                                    className="block w-full px-5 py-4 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-slate-900"
                                    value={name} onChange={e => setName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </motion.div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email address</label>
                            <input 
                                type="email" required 
                                className="block w-full px-5 py-4 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-slate-900"
                                value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                            <input 
                                type="password" required 
                                className="block w-full px-5 py-4 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-slate-900"
                                value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        
                        {!isLogin && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">I am joining as a:</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setRole('student')}
                                        className={`py-3.5 rounded-xl border font-bold transition-all ${role === 'student' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20 shadow-inner' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        Student
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setRole('instructor')}
                                        className={`py-3.5 rounded-xl border font-bold transition-all ${role === 'instructor' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20 shadow-inner' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        Instructor
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 px-4 rounded-xl text-white bg-slate-900 hover:bg-slate-800 font-bold transition-all shadow-xl shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign in to account' : 'Create account')}
                    </motion.button>
                </form>

                <div className="text-center mt-8">
                    <button 
                        type="button"
                        className="text-slate-500 hover:text-blue-600 font-semibold transition-colors"
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
