import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { PlayCircle, CheckCircle, FileText, MessageSquare, Send, ChevronLeft, Lock, ShoppingCart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [progress, setProgress] = useState(0);
    const [completedLessons, setCompletedLessons] = useState([]);
    
    // Enrollment state
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isEnrollLoading, setIsEnrollLoading] = useState(false);

    const [aiQuery, setAiQuery] = useState('');
    const [aiChat, setAiChat] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const chatEndRef = useRef(null);
    
    const { cart, addToCart } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }

        const fetchCourseData = async () => {
            try {
                // Fetch course details
                const courseRes = await api.get(`/courses/${id}`);
                setCourse(courseRes.data);
                if (courseRes.data.lessons?.length > 0) {
                    setActiveLesson(courseRes.data.lessons[0]);
                }
                
                if (userId) {
                    // Fetch progress
                    const progRes = await api.get(`/progress/${userId}/course/${id}`);
                    setProgress(progRes.data.progress || 0);
                    setCompletedLessons(progRes.data.completed_lessons || []);

                    // Check enrollment
                    const enrollRes = await api.get(`/courses/enrolled/${userId}`);
                    const enrolledIds = enrollRes.data.map(c => c.id.toString());
                    setIsEnrolled(enrolledIds.includes(id.toString()));
                }
            } catch (err) {
                console.log("Error fetching course data", err);
            }
        };
        fetchCourseData();
    }, [id, userId, navigate, token]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiChat]);

    const handleEnroll = async () => {
        setIsEnrollLoading(true);
        try {
            await api.post(`/courses/${id}/enroll`, { user_id: userId });
            setIsEnrolled(true);
        } catch (err) {
            console.error(err);
            alert("Error enrolling in the course. " + (err.response?.data?.message || ''));
        }
        setIsEnrollLoading(false);
    };

    const handleAddToCart = () => {
        if (course) {
            const success = addToCart(course);
            if (success) {
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 2000);
            }
        }
    };

    const handleMarkComplete = async () => {
        if (completedLessons.includes(activeLesson.id) || !isEnrolled) return;
        try {
            await api.post('/progress', { user_id: userId, lesson_id: activeLesson.id });
            const progRes = await api.get(`/progress/${userId}/course/${id}`);
            setProgress(progRes.data.progress);
            setCompletedLessons(progRes.data.completed_lessons || []);
        } catch (err) {
            console.error("Failed to mark complete", err);
        }
    };

    const handleAskAI = async (e) => {
        e.preventDefault();
        if (!aiQuery.trim() || !isEnrolled) return;
        
        const newMsg = { sender: 'user', text: aiQuery };
        setAiChat(prev => [...prev, newMsg]);
        setAiQuery('');
        setIsAiLoading(true);
        
        try {
            const res = await api.post('/ask-ai', {
                question: newMsg.text,
                lesson_title: activeLesson.title
            });
            setAiChat(prev => [...prev, { sender: 'ai', text: res.data.answer }]);
        } catch (err) {
            setAiChat(prev => [...prev, { sender: 'ai', text: "I'm having trouble connecting right now, but I'd suggest reviewing the previous video section for context!" }]);
        }
        setIsAiLoading(false);
    };

    if (!course || !activeLesson) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-medium text-slate-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const isInCart = cart.some(item => item.id === course.id);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <header className="bg-slate-900 text-white py-6 px-4 sm:px-6 lg:px-8 shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 blur-3xl rounded-full translate-y-1/2" />
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div>
                        <button onClick={() => navigate('/courses')} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold mb-4 transition-colors bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm w-fit">
                            <ChevronLeft className="w-4 h-4" /> Back to courses
                        </button>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{course.title}</h1>
                        <p className="text-blue-300 font-medium mt-2">Instructor: <span className="text-white">{course.instructor_name}</span></p>
                    </div>
                    {isEnrolled ? (
                        <div className="flex flex-col md:items-end w-full md:w-72 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                            <div className="flex justify-between w-full text-sm mb-2 font-bold">
                                <span className="text-slate-300">Course Progress</span>
                                <span className="text-blue-400">{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" 
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button 
                                onClick={handleAddToCart}
                                disabled={isInCart}
                                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                                    justAdded ? 'bg-green-500 text-white' 
                                    : isInCart ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                }`}
                            >
                                {justAdded ? <><Check className="w-5 h-5"/> Added!</> : isInCart ? <><Check className="w-5 h-5"/> In Cart</> : <><ShoppingCart className="w-5 h-5"/> Add to Cart</>}
                            </button>
                            <button 
                                onClick={handleEnroll} 
                                disabled={isEnrollLoading}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2"
                            >
                                {isEnrollLoading ? 'Processing...' : 'Enroll Now'}
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
                
                <div className="lg:w-2/3 flex flex-col gap-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl relative flex items-center justify-center border border-slate-200/20"
                    >
                        {!isEnrolled ? (
                            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-20">
                                <Lock className="w-20 h-20 text-white/20 mb-6" />
                                <h2 className="text-3xl font-extrabold text-white mb-3">Enroll to unlock content</h2>
                                <p className="text-slate-400 mb-8 max-w-md font-medium text-lg">You must be formally enrolled in this course to watch videos and interact with the AI tutor.</p>
                                <button 
                                    onClick={handleEnroll} 
                                    disabled={isEnrollLoading}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/30 text-lg hover:-translate-y-1"
                                >
                                    {isEnrollLoading ? 'Processing...' : 'Start Learning Now'}
                                </button>
                            </div>
                        ) : activeLesson.video_url ? (
                            <iframe 
                                src={activeLesson.video_url} 
                                className="absolute inset-0 w-full h-full z-10"
                                title={activeLesson.title}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="text-slate-500 flex flex-col items-center gap-3">
                                <PlayCircle className="w-16 h-16 opacity-30" />
                                <span className="font-bold text-lg">No video available</span>
                            </div>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeLesson.title}</h2>
                            {isEnrolled && (
                                <button 
                                    onClick={handleMarkComplete}
                                    disabled={completedLessons.includes(activeLesson.id)}
                                    className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all ${
                                        completedLessons.includes(activeLesson.id) 
                                        ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed border border-emerald-200' 
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 hover:-translate-y-1'
                                    }`}
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    {completedLessons.includes(activeLesson.id) ? 'Completed' : 'Mark as Complete'}
                                </button>
                            )}
                        </div>
                        
                        <div>
                            <h3 className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                                <div className="p-2 bg-blue-100 rounded-xl"><FileText className="w-5 h-5 text-blue-600" /></div> 
                                Lesson Notes
                            </h3>
                            <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
                                {isEnrolled ? (
                                    <p>{activeLesson.content_notes || 'No notes available for this lesson.'}</p>
                                ) : (
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center">
                                        <p className="italic text-slate-500">Notes are locked. Enroll to view.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-8">
                    
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col max-h-[450px]">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
                            <h3 className="font-extrabold text-xl text-slate-900">Course Content</h3>
                        </div>
                        <div className="overflow-y-auto p-3 flex flex-col gap-2">
                            {course.lessons.map((lesson, idx) => {
                                const isCompleted = completedLessons.includes(lesson.id);
                                const isActive = activeLesson.id === lesson.id;
                                return (
                                    <button 
                                        key={lesson.id}
                                        onClick={() => isEnrolled && setActiveLesson(lesson)}
                                        className={`flex items-center gap-4 p-4 text-left rounded-2xl transition-all ${
                                            isActive && isEnrolled ? 'bg-blue-50 border-blue-200 shadow-inner' : 'hover:bg-slate-50 border-transparent border'
                                        } ${!isEnrolled && 'opacity-60 cursor-not-allowed'}`}
                                    >
                                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100">
                                            {isCompleted ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <PlayCircle className={`w-5 h-5 ${isActive && isEnrolled ? 'text-blue-600' : 'text-slate-400'}`} />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <p className={`font-bold ${isActive && isEnrolled ? 'text-blue-900' : 'text-slate-700'} text-sm line-clamp-2`}>
                                                {idx + 1}. {lesson.title}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col flex-grow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 z-0" />
                        <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-t-3xl text-white flex items-center gap-3 relative z-10">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><MessageSquare className="w-5 h-5" /></div>
                            <h3 className="font-extrabold text-xl">Ask AI Tutor</h3>
                        </div>
                        
                        <div className="flex-grow p-5 overflow-y-auto flex flex-col gap-4 min-h-[300px] max-h-[400px] bg-slate-50 relative">
                            {!isEnrolled && (
                                <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                                    <div className="bg-white p-4 rounded-full shadow-lg mb-4">
                                        <Lock className="w-8 h-8 text-indigo-300" />
                                    </div>
                                    <span className="text-lg font-extrabold text-slate-800">AI Tutor is Locked</span>
                                    <span className="text-sm font-medium text-slate-500 mt-2">Enroll to interact with your personal AI assistant.</span>
                                </div>
                            )}

                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-700 shadow-sm self-start max-w-[85%] font-medium leading-relaxed">
                                👋 Hi there! I'm your AI tutor. Ask me anything about <strong>{activeLesson.title}</strong>!
                            </div>
                            
                            {aiChat.map((msg, i) => (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`p-4 text-sm rounded-2xl shadow-sm max-w-[85%] font-medium leading-relaxed ${
                                    msg.sender === 'user' 
                                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white self-end rounded-tr-sm' 
                                    : 'bg-white border border-slate-100 text-slate-700 self-start rounded-tl-sm'
                                }`}>
                                    {msg.text}
                                </motion.div>
                            ))}
                            
                            {isAiLoading && (
                                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-500 shadow-sm self-start max-w-[85%] flex items-center gap-2">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        
                        <div className="p-4 bg-white rounded-b-3xl border-t border-slate-100 relative z-10">
                            <form onSubmit={handleAskAI} className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={aiQuery} 
                                    onChange={e => setAiQuery(e.target.value)} 
                                    placeholder="Ask a question..."
                                    disabled={!isEnrolled}
                                    className="flex-grow px-5 py-3.5 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50 text-slate-900 placeholder-slate-400"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!aiQuery.trim() || isAiLoading || !isEnrolled}
                                    className="bg-indigo-600 text-white p-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg flex items-center justify-center w-14"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default CourseDetail;
