// src/components/LoadingIndicator.jsx (ফাইনাল, স্টাইলিশ ভার্সন)

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingIndicator = ({ isLoading }) => {
    // লোডার বারের প্রস্থ এবং রং সেট করা হয়েছে
    const barHeight = 'h-1.5';
    const gradientColors = 'bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600';

    // মূল লোডার বারের অ্যানিমেশন: 0 থেকে 100% পর্যন্ত যাবে
    const barVariants = {
        hidden: { width: 0, opacity: 0 },
        visible: {
            width: "100%",
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        },
        // লোডিং শেষ হওয়ার পর এক্সিট অ্যানিমেশন
        exit: {
            opacity: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    // ফ্ল্যাশ লাইটের মতো শাইনিং ইফেক্ট
    const shineVariants = {
        start: { x: '-100%' },
        end: { x: '200%' }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                // মূল কন্টেইনার: এটি সবসময় স্ক্রিনের উপরে স্থির থাকবে
                <motion.div
                    className={`fixed top-0 left-0 right-0 ${barHeight} z-[9999] overflow-hidden`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={barVariants}
                >
                    {/* মূল প্রোগ্রেস স্ট্রাইপ (ধরে নিচ্ছি এটি 100% এ দ্রুত পৌঁছাচ্ছে) */}
                    <motion.div
                        className={`w-full h-full ${gradientColors} shadow-lg shadow-pink-500/50`}
                        // এখানে আমরা অন্যভাবে লোডিং দেখাবো: একটি অবিরাম পালস ইফেক্ট
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            duration: 0.5, // দ্রুত 100% এ পৌঁছাবে
                            ease: "easeOut"
                        }}
                        style={{ originX: 0 }} // বাম দিক থেকে শুরু হবে
                    >
                        {/* 🌟 শাইনিং পালস ইফেক্ট: এটি লোডার স্ট্রাইপের উপর দিয়ে অবিরাম স্লাইড করবে */}
                        <motion.div
                            className="absolute inset-0 bg-white/50 w-1/4 h-full"
                            variants={shineVariants}
                            initial="start"
                            animate="end"
                            transition={{
                                duration: 1.2,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                            style={{
                                filter: 'blur(10px)', // ব্লার দিয়ে নরম ইফেক্ট
                                opacity: 0.8
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingIndicator;