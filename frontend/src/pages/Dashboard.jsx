import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { BookOpen, Award, Clock, Activity, PlusCircle, CheckCircle, ChevronRight, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('overview'); // overview, enrolled, certificates

    const activityData = [
        { name: 'Mon', hours: 1 },
        { name: 'Tue', hours: 2 },
        { name: 'Wed', hours: 1.5 },
        { name: 'Thu', hours: 3 },
        { name: 'Fri', hours: 2.5 },
        { name: 'Sat', hours: 4 },
        { name: 'Sun', hours: 3.5 },
    ];

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }
        
        const fetchDashboardData = async () => {
            if (userRole === 'student' && userId) {
                try {
                    const res = await api.get(`/courses/enrolled/${userId}`);
                    setEnrolledCourses(res.data);
                } catch (err) {
                    console.error("Failed to fetch enrollments", err);
                }
            }
        };
        fetchDashboardData();
    }, [navigate, token, userRole, userId]);

    const totalHours = Math.round(activityData.reduce((acc, curr) => acc + curr.hours, 0));

    const mockCertificates = enrolledCourses.slice(0, 1).map(c => ({
        id: c.id,
        course_title: c.title,
        date: 'Oct 12, 2026',
        instructor: c.instructor_name
    }));

    const tabVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{userName}</span>!
                    </h1>
                    <p className="mt-3 text-xl text-slate-500 font-medium max-w-2xl">
                        {userRole === 'instructor' 
                            ? 'Manage your courses and view student engagement.'
                            : "Here's what's happening with your learning journey today."}
                    </p>
                </motion.div>

                {/* Stat Cards - Clicking these changes the Tabs */}
                {userRole === 'student' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { id: 'overview', title: 'Hours Learned', value: `${totalHours}h`, icon: Activity, color: 'indigo' },
                            { id: 'enrolled', title: 'Enrolled Courses', value: enrolledCourses.length, icon: BookOpen, color: 'blue' },
                            { id: 'certificates', title: 'Certificates Earned', value: mockCertificates.length, icon: Award, color: 'emerald' },
                        ].map((stat) => {
                            const Icon = stat.icon;
                            const isActive = activeTab === stat.id;
                            return (
                                <motion.div 
                                    key={stat.id}
                                    whileHover={{ y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab(stat.id)}
                                    className={`p-6 rounded-3xl shadow-sm border flex items-center gap-5 cursor-pointer transition-all ${
                                        isActive 
                                        ? `bg-${stat.color}-50 border-${stat.color}-200 ring-2 ring-${stat.color}-500/20 shadow-md` 
                                        : `bg-white border-slate-100 hover:border-${stat.color}-200 hover:shadow-md`
                                    }`}
                                >
                                    <div className={`p-4 rounded-2xl bg-${stat.color}-100 text-${stat.color}-600`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
                                        <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 relative min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div key="overview" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-extrabold text-slate-900">
                                            {userRole === 'instructor' ? 'Your Courses' : 'Continue Learning'}
                                        </h2>
                                        {userRole === 'instructor' && (
                                            <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-colors">
                                                <PlusCircle className="w-4 h-4" /> Create Course
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-5">
                                        {userRole === 'student' && enrolledCourses.slice(0, 2).map((course) => (
                                            <div key={course.id} className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group bg-slate-50 hover:bg-white cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
                                                <div className="w-full sm:w-48 h-32 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                                                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                                                </div>
                                                <div className="flex-grow flex flex-col justify-center">
                                                    <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest mb-2 block">{course.category}</span>
                                                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mb-4">{course.title}</h3>
                                                    <div className="mt-auto">
                                                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                                                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                                        </div>
                                                        <div className="flex justify-between text-xs font-bold text-slate-500">
                                                            <span>45% Complete</span>
                                                            <span className="flex items-center gap-1 text-blue-600">Resume <ChevronRight className="w-3 h-3" /></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {userRole === 'student' && enrolledCourses.length === 0 && (
                                            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                                <p className="font-medium text-lg">You haven't enrolled in any courses yet.</p>
                                                <button onClick={() => navigate('/courses')} className="mt-4 text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold shadow-md transition-all">Browse Courses</button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'enrolled' && (
                                <motion.div key="enrolled" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-xl"><BookOpen className="text-blue-600 w-6 h-6" /></div> 
                                        All Enrolled Courses
                                    </h2>
                                    <div className="space-y-5">
                                        {enrolledCourses.map((course) => (
                                            <div key={course.id} className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group bg-white cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
                                                <div className="w-full sm:w-40 h-28 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 relative">
                                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; }} />
                                                </div>
                                                <div className="flex-grow flex flex-col justify-center">
                                                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{course.title}</h3>
                                                    <span className="text-sm font-bold text-slate-500 mb-2">Instructor: {course.instructor_name}</span>
                                                </div>
                                                <div className="flex items-center px-2">
                                                    <button className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-colors w-full sm:w-auto text-center shadow-sm">Start Module</button>
                                                </div>
                                            </div>
                                        ))}
                                        {enrolledCourses.length === 0 && <div className="text-center py-10 font-medium text-slate-500">No courses enrolled.</div>}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'certificates' && (
                                <motion.div key="certificates" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 rounded-xl"><Award className="text-emerald-600 w-6 h-6" /></div> 
                                        Earned Certificates
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {mockCertificates.map((cert, index) => (
                                            <div key={index} className="border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 relative overflow-hidden group shadow-lg hover:shadow-xl transition-shadow">
                                                <div className="absolute -right-6 -bottom-6 text-emerald-500/10 transform -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-500">
                                                    <Award className="w-40 h-40" />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Award className="w-5 h-5 text-emerald-600" />
                                                        <span className="text-xs font-extrabold tracking-widest text-emerald-700 uppercase">Official Certificate</span>
                                                    </div>
                                                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-4">{cert.course_title}</h3>
                                                    <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-emerald-100 mb-6">
                                                        <p className="text-sm font-bold text-slate-600">
                                                            <span className="text-slate-400 block text-xs uppercase mb-1">Issued on</span>
                                                            {cert.date}
                                                        </p>
                                                        <p className="text-sm font-bold text-slate-600 mt-2">
                                                            <span className="text-slate-400 block text-xs uppercase mb-1">Instructor</span>
                                                            {cert.instructor}
                                                        </p>
                                                    </div>
                                                    <button className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md transition-all hover:-translate-y-0.5">
                                                        <Download className="w-4 h-4" /> Download PDF
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {mockCertificates.length === 0 && <div className="col-span-full text-center py-10 font-medium text-slate-500">You haven't earned any certificates yet. Complete a course to earn one!</div>}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar / Chart Area */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-blue-100 rounded-xl"><Activity className="w-6 h-6 text-blue-600" /></div>
                                <h3 className="text-xl font-extrabold text-slate-900">Activity Analytics</h3>
                            </div>
                            
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={activityData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                                            cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                                        />
                                        <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={4} dot={{r: 5, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 8, stroke: '#2563eb', strokeWidth: 2}} animationDuration={1500} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
