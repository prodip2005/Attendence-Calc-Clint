import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth"; // Logged-in user info
import { motion } from 'framer-motion';
import Swal from "sweetalert2";

// --- Inline Spinner Component ---
// eslint-disable-next-line react-refresh/only-export-components
const InlineSpinner = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center w-full bg-gray-50 p-12">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-4 border-indigo-600 border-t-transparent rounded-full"
            />
            <p className="mt-4 text-xl font-medium text-indigo-700">Loading user data...</p>
        </div>
    );
};

const Create_Table = () => {
    const subjects = ["Math", "Physics", "Chemistry", "English", "CSIT", "EEE"];
    const { user, authLoading } = useAuth(); // Logged-in user + auth loading
    const [isLoading, setIsLoading] = useState(true);

    // Initialize attendance data
    const [attendanceData, setAttendanceData] = useState(
        subjects.map(subject => ({
            name: subject,
            attended: 0,
            total: 0
        }))
    );

    // Wait until user is loaded
    useEffect(() => {
        if (!authLoading && user) {
            setIsLoading(false);
        }
    }, [user, authLoading]);

    // Handle input changes
    const handleInputChange = (index, field, value) => {
        setAttendanceData(prevData => {
            const newData = [...prevData];
            let numericValue = Math.max(0, parseInt(value) || 0);

            // Ensure attended <= total
            if (field === 'attended') {
                numericValue = Math.min(numericValue, newData[index].total);
            }
            newData[index] = {
                ...newData[index],
                [field]: numericValue
            };
            return newData;
        });
    };

    // Form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = {
            name: user?.displayName || "N/A",
            email: user?.email || "N/A",
            subjects: attendanceData
        };

        try {
            const response = await fetch('https://attendence-calc-kappa.vercel.app/allData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            });

            if (response.ok) {
                const result = await response.json();

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Attendance record posted successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });

                console.log("Post success:", result);
            } else if (response.status === 409) {

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "The record already exists!",
                });
            } else {

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to save the record!",
                });

            }
        } catch (error) {
            console.error("Network error during post:", error);

            Swal.fire({
                title: "The Internet?",
                text: "A network error occurred.",
                icon: "question"
            });
        }
    };

    if (isLoading || !user) {
        return <InlineSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-8 animate-fadeInUp">
                <h2 className="text-3xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 animate-pulse">
                    ➕ Create New Attendance Record
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Student Name</label>
                            <input
                                type="text"
                                defaultValue={user?.displayName}
                                readOnly
                                className="input input-bordered w-full p-4 rounded-xl border-gray-300 shadow-inner focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                defaultValue={user?.email}
                                readOnly
                                className="input input-bordered w-full p-4 rounded-xl border-gray-300 shadow-inner focus:ring-2 focus:ring-blue-400"
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
                                <h3 className="font-bold text-gray-800 mb-3 text-lg">{subject}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-600 text-sm mb-1">Total Classes</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={attendanceData[idx].total}
                                            onChange={(e) => handleInputChange(idx, 'total', e.target.value)}
                                            className="input input-bordered w-full p-3 rounded-xl border-gray-300 shadow-inner focus:ring-2 focus:ring-green-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 text-sm mb-1">Attended</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={attendanceData[idx].attended}
                                            onChange={(e) => handleInputChange(idx, 'attended', e.target.value)}
                                            className="input input-bordered w-full p-3 rounded-xl border-gray-300 shadow-inner focus:ring-2 focus:ring-green-400"
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
                            className="h-10 w-full md:w-1/2 text-white text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-xl transform hover:scale-[1.05] transition-all duration-300"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Create_Table;
