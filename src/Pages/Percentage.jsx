import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; // নিশ্চিত করুন এটি user এবং authLoading প্রদান করে

// ব্যাকএন্ড API URL
const API_URL = 'https://attendence-calc-kappa.vercel.app/allData';

// --- এনিমেশন ভ্যারিয়েন্ট ---
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

// পার্সেন্টেজ অনুযায়ী রঙের শ্রেণীবিভাগ (Tailwind classes)
const getColorClass = (percent) => {
    if (percent >= 75) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
};

// পার্সেন্টেজ অনুযায়ী হেক্স কালার (SVG এর stroke-এর জন্য)
const getHexColor = (percent) => {
    if (percent >= 75) return '#10b981'; // green-500
    if (percent >= 60) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
};

// --- সার্কেল প্রোগ্রেস কম্পোনেন্ট (Overall Attendance) ---
const AnimatedCircleProgress = ({ percentage, totalAttended, totalClasses }) => {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const colorClass = getColorClass(percentage);
    const strokeColor = getHexColor(percentage);

    return (
        <motion.div
            className="relative flex items-center justify-center w-64 h-64 mx-auto"
            initial={{ scale: 0.8, rotate: -90 }}
            animate={{ scale: 1, rotate: -90 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
        >
            <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* ব্যাকগ্রাউন্ড রিং */}
                <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke="#e5e7eb"
                    strokeWidth="20"
                />
                {/* প্রোগ্রেস রিং */}
                <motion.circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeDashoffset }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}

                    strokeWidth="20"
                    strokeLinecap="round"
                    stroke={strokeColor}
                />
            </svg>

            {/* পার্সেন্টেজ সংখ্যা এবং তথ্য */}
            <motion.div
                className="absolute text-center transform rotate-90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <motion.p
                    className={`font-black text-6xl tracking-tighter ${colorClass}`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 150, delay: 1.5 }}
                >
                    {percentage.toFixed(2)}%
                </motion.p>
                <p className="text-xl text-gray-500 mt-1">
                    {totalAttended} / {totalClasses} Classes
                </p>
            </motion.div>
        </motion.div>
    );
};

// --- সাবজেক্ট পার্সেন্টেজ বার ---
const PercentageBar = ({ subject, percentage, value, total, color }) => {
    const width = Math.min(100, Math.max(0, percentage));
    const bgColor = getHexColor(percentage);

    return (
        <motion.div variants={itemVariants} className="p-4 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm border border-gray-100 transform hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out border-l-4 border-indigo-300">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-gray-700">{subject}</h4>
                <motion.p
                    className={`font-extrabold text-2xl ${color}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                >
                    {percentage.toFixed(2)}%
                </motion.p>
            </div>

            <p className="text-sm text-gray-500 mb-2">Attended: {value}/{total}</p>

            <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                    className="h-3 rounded-full"
                    style={{ backgroundColor: bgColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                ></motion.div>
            </div>
        </motion.div>
    );
};


const Percentage = () => {
    const { user, authLoading } = useAuth();
    const [attendanceData, setAttendanceData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // মোট অ্যাটেন্ডেন্স গণনা
    let totalAttended = 0;
    let totalClasses = 0;
    let overallPercentage = 0;

    if (attendanceData) {
        attendanceData.subjects.forEach(sub => {
            totalAttended += sub.attended;
            totalClasses += sub.total;
        });

        if (totalClasses > 0) {
            overallPercentage = (totalAttended * 100) / totalClasses;
        }
    }

    useEffect(() => {
        if (authLoading) return;       // Wait for auth to finish
        if (!user?.email) return;      // Wait until user exists

        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}?email=${user.email}`);
                if (res.data && res.data.length > 0) {
                    setAttendanceData(res.data[0]);
                } else {
                    setError("No attendance record found. Please submit first.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch attendance data from server.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [user, authLoading]);


    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full"
                ></motion.div>
                <p className="mt-4 text-lg text-blue-600">Authenticating and Loading Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <motion.p
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-semibold text-red-700 p-8 rounded-lg shadow-lg"
                >
                    {error}
                </motion.p>
            </div>
        );
    }

    const student = attendanceData;
    const overallColorClass = getColorClass(overallPercentage);

    return (
        <motion.div
            className="p-8 min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-pink-500 tracking-tighter drop-shadow-md"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 50 }}
                >
                    🎓 Attendance Percentage Report
                </motion.h2>

                <motion.div
                    variants={itemVariants}
                    className="p-6 mb-8 rounded-2xl shadow-2xl bg-white border-b-4 border-indigo-400 transform hover:scale-[1.01] transition-transform"
                >
                    <p className="text-xl font-semibold text-gray-800">
                        Student: <span className="font-bold text-indigo-600">{student.name}</span>
                    </p>
                    <p className="text-lg text-gray-500">
                        Email: {student.email}
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="text-center mb-12 p-8 rounded-3xl shadow-3xl bg-white/95 border border-gray-200 backdrop-blur-sm"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
                >
                    <h3 className="text-3xl font-extrabold text-gray-700 mb-6">Overall Attendance Status</h3>

                    <AnimatedCircleProgress
                        percentage={overallPercentage}
                        totalAttended={totalAttended}
                        totalClasses={totalClasses}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {student.subjects.map((sub, index) => {
                        const percent = sub.total > 0 ? (sub.attended * 100) / sub.total : 0;
                        const color = getColorClass(percent);
                        return (
                            <PercentageBar
                                key={index}
                                subject={sub.name}
                                percentage={percent}
                                value={sub.attended}
                                total={sub.total}
                                color={color}
                            />
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default Percentage;
