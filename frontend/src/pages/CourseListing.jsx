import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, Clock, Star, Flame, ShoppingCart, PlusCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CourseListing = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    
    const { cart, addToCart } = useCart();
    const [addedStates, setAddedStates] = useState({});

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/courses?search=${search}&category=${category}`);
            setCourses(res.data);
        } catch (err) {
            console.error("Failed to fetch courses");
            setCourses([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCourses();
    }, [category]); // eslint-disable-line

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses();
    };

    const handleAddToCart = (e, course) => {
        e.stopPropagation();
        const success = addToCart(course);
        if (success) {
            setAddedStates(prev => ({ ...prev, [course.id]: true }));
            setTimeout(() => {
                setAddedStates(prev => ({ ...prev, [course.id]: false }));
            }, 2000);
        }
    };

    const isFiltered = search !== '' || category !== '';
    const recommendedCourses = isFiltered ? [] : courses.slice(0, 3);
    const displayedCourses = isFiltered ? courses : courses.filter(c => !recommendedCourses.find(rc => rc.id === c.id));

    const renderCourseCard = (course, isRecommended = false) => {
        const isInCart = cart.some(item => item.id === course.id);
        const justAdded = addedStates[course.id];

        return (
            <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={course.id} 
                onClick={() => navigate(`/courses/${course.id}`)} 
                className={`bg-white rounded-3xl shadow-sm border ${isRecommended ? 'border-orange-200 shadow-orange-100/50' : 'border-slate-100'} overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group flex flex-col h-full`}
            >
                <div className="h-52 bg-slate-200 relative overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>
                    
                    {isRecommended && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-xs font-bold text-white shadow-lg flex items-center gap-1 backdrop-blur-md">
                            <Flame className="w-3 h-3" /> Recommended
                        </div>
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-slate-900 shadow-lg">
                        {course.category}
                    </div>
                </div>
                <div className="p-6 flex flex-col flex-grow bg-white">
                    <h3 className="font-extrabold text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-slate-500 mb-6 font-medium">{course.instructor_name || 'Instructor Admin'}</p>
                    
                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center gap-1.5 font-bold">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-slate-900">4.8</span>
                            <span className="text-slate-400 text-xs font-medium">(1.2k)</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration || '2.5h'}</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={(e) => handleAddToCart(e, course)}
                        disabled={isInCart}
                        className={`mt-4 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                            justAdded ? 'bg-green-50 text-green-600 border border-green-200' 
                            : isInCart ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100'
                        }`}
                    >
                        {justAdded ? (
                            <><Check className="w-4 h-4" /> Added!</>
                        ) : isInCart ? (
                            <><Check className="w-4 h-4" /> In Cart</>
                        ) : (
                            <><PlusCircle className="w-4 h-4" /> Add to Cart</>
                        )}
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Explore Courses</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Discover thousands of courses curated by industry experts and take your skills to the next level.</p>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4 mb-12 relative z-10">
                    <form onSubmit={handleSearch} className="flex-grow flex relative">
                        <input 
                            type="text" 
                            placeholder="Search for anything..." 
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-900"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="w-6 h-6 text-slate-400 absolute left-5 top-4" />
                        <button type="submit" className="hidden"></button>
                    </form>
                    
                    <div className="flex items-center gap-2 relative min-w-[220px]">
                        <Filter className="w-5 h-5 text-slate-400 absolute left-5 z-10" />
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full pl-14 pr-10 py-4 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none font-bold text-slate-900 cursor-pointer transition-all"
                        >
                            <option value="">All Categories</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Design">Design</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white h-96 rounded-3xl animate-pulse border border-slate-100" />
                        ))}
                    </div>
                ) : (
                    <AnimatePresence>
                        {/* Recommended Section */}
                        {!search && !category && recommendedCourses.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-16">
                                <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-xl"><Flame className="w-6 h-6 text-orange-500" /></div>
                                    Highly Recommended For You
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {recommendedCourses.map(c => renderCourseCard(c, true))}
                                </div>
                            </motion.div>
                        )}

                        {/* All Courses Section */}
                        {displayedCourses.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <h2 className="text-3xl font-extrabold text-slate-900 mb-8">
                                    {isFiltered ? 'Search Results' : 'All Courses'}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {displayedCourses.map(c => renderCourseCard(c, false))}
                                </div>
                            </motion.div>
                        )}

                        {courses.length === 0 && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="col-span-full text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">No courses found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto font-medium">We couldn't find any courses matching your search criteria. Try adjusting your filters.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default CourseListing;
