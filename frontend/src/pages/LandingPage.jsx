import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Users, ArrowRight, Play, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-40 overflow-hidden flex flex-col items-center justify-center px-4 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-400/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl -z-10" />
                
                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-5xl mx-auto z-10">
                    <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm mb-8 shadow-sm">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        New premium courses added for 2026
                    </motion.div>
                    
                    <motion.h1 variants={fadeIn} className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                        Master your skills with <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">world-class</span> learning
                    </motion.h1>
                    
                    <motion.p variants={fadeIn} className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium mb-10 leading-relaxed">
                        Join thousands of ambitious students learning from expert instructors. Build your future in tech, design, and business today.
                    </motion.p>
                    
                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <Link to="/courses" className="flex items-center justify-center gap-2 px-10 py-4 text-lg font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 w-full sm:w-auto">
                            Browse Courses
                        </Link>
                        <Link to="/auth?signup=true" className="flex items-center justify-center gap-2 px-10 py-4 text-lg font-bold rounded-2xl text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm w-full sm:w-auto group">
                            Join for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-32 bg-white px-4 relative z-20 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.05)] rounded-t-[3rem]">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Why choose LearnSpace?</h2>
                        <p className="text-xl text-slate-500 font-medium">Everything you need to accelerate your career growth.</p>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { icon: BookOpen, title: "Expert-led Courses", desc: "Learn from industry professionals with real-world experience and detailed curriculum.", color: "blue" },
                            { icon: Award, title: "Earn Certificates", desc: "Get recognized for your hard work with verifiable certificates upon completion.", color: "indigo" },
                            { icon: Users, title: "Community Support", desc: "Join a community of thousands of learners. Ask questions and get help instantly.", color: "purple" }
                        ].map((feature, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                whileHover={{ y: -10 }}
                                className="flex flex-col p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-100 flex items-center justify-center mb-8 text-${feature.color}-600 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
