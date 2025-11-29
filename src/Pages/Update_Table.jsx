import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useForm } from "react-hook-form";
import { motion } from 'framer-motion';// ✅ useForm ইম্পোর্ট
import axios from 'axios'; // ✅ axios ইম্পোর্ট
import Swal from 'sweetalert2';

const API_URL = 'https://attendence-calc-kappa.vercel.app/allData'; // GET করার জন্য
const UPDATE_URL = 'https://attendence-calc-kappa.vercel.app/updateData'; // PATCH করার জন্য

const Update_Table = () => {
    const { user } = useAuth();
    const subjects = ["Math", "Physics", "Chemistry", "English", "CSIT", "EEE"];

    // রিয়েল টাইম আপডেট এবং লোডিং স্টেট ট্র্যাক করার জন্য
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // useForm সেটআপ
    const {
        register,
        handleSubmit,
        reset, // ডেটা লোড করার জন্য reset ব্যবহার করব
    } = useForm({
        defaultValues: {
            name: user?.displayName || "",
            email: user?.email || ""
        }
    });

    // 1. ডেটা লোড করার জন্য useEffect
    useEffect(() => {
        const fetchExistingData = async () => {
            if (!user?.email) {
                setIsLoading(false);
                return;
            }

            try {
                // ইমেল দিয়ে বিদ্যমান রেকর্ডটি GET করা
                const response = await axios.get(`${API_URL}?email=${user.email}`);
                const data = response.data;

                if (data && data.length > 0) {
                    const existingRecord = data[0];
                    const defaultValues = {
                        name: existingRecord.name,
                        email: existingRecord.email,
                    };

                    // সাবজেক্টের ডেটা ফর্মের ফিল্ডে সেট করা
                    existingRecord.subjects.forEach(sub => {
                        defaultValues[`${sub.name}_total`] = sub.total;
                        defaultValues[`${sub.name}_attended`] = sub.attended;
                    });

                    // useForm এর reset ফাংশন ব্যবহার করে ফর্মের মান সেট করা
                    reset(defaultValues);
                } else {
                    setError("No previous record found for this email. Please create a record first.");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load existing attendance data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchExistingData();
    }, [user, reset]); // user বা reset ফাংশন পরিবর্তন হলে এটি চলবে

    // 2. ফর্ম সাবমিট হ্যান্ডলার
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError(null);

        // MongoDB তে পাঠানোর জন্য ডেটা কাঠামো তৈরি 
        const subjectsData = subjects.map((subject) => ({
            name: subject,
            total: parseInt(data[`${subject}_total`]) || 0,
            attended: parseInt(data[`${subject}_attended`]) || 0,
        }));

        const finalData = {
            email: user?.email || data.email, // ইমেল দিয়ে আপডেট করব
            subjects: subjectsData
        };

        try {
            // ✅ PATCH রিকোয়েস্ট
            const response = await axios.patch(UPDATE_URL, finalData);

            if (response.data.modifiedCount > 0) {

                Swal.fire({
                    title: "Attendance record updated successfully!",
                    icon: "success",
                    draggable: true
                });
            } else if (response.data.matchedCount > 0) {

                Swal.fire({
                    icon: "error",
                    text: "Record matched, but no changes were made.",
                });
            } else {

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Update failed. Record not found.",
                });
            }

        } catch (err) {
            // console.error("Update error:", err.response ? err.response.data : err.message);

        } finally {
            setIsSubmitting(false);
        }
    };

    // লোডিং স্ক্রিন
    if (isLoading) {
        return <div className="min-h-[400px] flex flex-col items-center justify-center w-full bg-gray-50 p-12">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-4 border-indigo-600 border-t-transparent rounded-full"
            ></motion.div>
            <p className="mt-4 text-xl font-medium text-indigo-700">Loading Existing Data</p>
        </div>
    }

    // এরর স্ক্রিন
    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-linear-to-r from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-8 animate-fadeInUp">
                <h2 className="text-3xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-blue-500 animate-pulse">
                    📝 Update Attendance Record
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Name & Email (Default values are loaded by reset()) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative group">
                            <label className="block text-gray-700 font-semibold mb-2">Student Name</label>
                            <input
                                type="text"
                                readOnly
                                // ✅ register() ব্যবহার করা হয়েছে যাতে reset() এটিকে নিয়ন্ত্রণ করতে পারে
                                {...register("name")}
                                className="input input-bordered w-full p-4 rounded-xl border-gray-300 shadow-inner focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 group-hover:scale-[1.02]"
                            />
                        </div>

                        <div className="relative group">
                            <label className="block text-gray-700 font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                readOnly
                                // ✅ register() ব্যবহার করা হয়েছে
                                {...register("email")}
                                className="input input-bordered w-full p-4 rounded-xl border-gray-300 shadow-inner focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 group-hover:scale-[1.02]"
                            />
                        </div>
                    </div>

                    {/* Subjects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {subjects.map((subject, idx) => (
                            <div
                                key={idx}
                                className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
                            >
                                <h3 className="font-bold text-gray-800 mb-3 text-lg animate-fadeInLeft">{subject}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <label className="block text-gray-600 text-sm mb-1">Total Classes</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            // ✅ register() দিয়ে ইনপুট ফিল্ডের নাম সেট করা: যেমন 'Math_total'
                                            {...register(`${subject}_total`)}
                                            className="input input-bordered w-full p-3 rounded-xl border-gray-300 shadow-inner focus:ring-2 focus:ring-green-400 transition-all duration-300 group-hover:scale-[1.02]"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <label className="block text-gray-600 text-sm mb-1">Attended</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            // ✅ register() দিয়ে ইনপুট ফিল্ডের নাম সেট করা: যেমন 'Math_attended'
                                            {...register(`${subject}_attended`)}
                                            className="input input-bordered w-full p-3 rounded-xl border-gray-300 shadow-inner focus:ring-2 focus:ring-green-400 transition-all duration-300 group-hover:scale-[1.02]"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-10 text-white w-full md:w-1/2 text-lg font-bold bg-linear-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-xl transform hover:scale-[1.05] transition-all duration-300 disabled:opacity-50"
                        >
                            {isSubmitting ? "Updating..." : "Update Record"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Update_Table;