import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import useAuth from '../hooks/useAuth';
import LoadingIndicator from './LoadingIndicator';
import Swal from 'sweetalert2';

// ব্যাকএন্ড API URL
const API_URL = 'https://attendence-calc-kappa.vercel.app/allData';

const AttendanceTable = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const subjects = ["Math", "Physics", "Chemistry", "English", "CSIT", "EEE"];

    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                const response = await axios.get(API_URL);
                setStudents(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load attendance data. Please check server connection.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllStudents();
    }, []);

    // একটি নির্দিষ্ট সাবজেক্টের জন্য Attended/Total ফর্ম্যাট তৈরি করার ফাংশন
    const getAttendanceStatus = (student, subjectName) => {
        const subjectRecord = student.subjects.find(sub => sub.name === subjectName);
        if (subjectRecord) {
            return `${subjectRecord.attended}/${subjectRecord.total}`;
        }
        return "N/A";
    };

    // --- এডিট বাটন ক্লিক হ্যান্ডেল করা ---
    const handleEditClick = (studentEmail) => {
        const loggedInEmail = user?.email;

        if (loggedInEmail === studentEmail) {
            console.log(`Navigating to edit page for ${studentEmail}`);
            return true;
        } else {

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You can only edit your own attendance record.",

            });
            return false;
        }
    };
    // ----------------------------------------------------

    // ✅ --- নতুন ফাংশন: ডিলিট বাটন ক্লিক হ্যান্ডেল করা ---
    const handleDeleteClick = async (studentEmail, studentId) => {
        // Only the logged-in user can delete their own record
        if (user?.email !== studentEmail) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You can only delete your own attendance record.",
            });
            return;
        }


        // ✅ SweetAlert2 confirmation
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete your attendance record?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "No",
        });

        if (!result.isConfirmed) return;

        try {
            // API call to delete the record from the database
            await axios.delete(`${API_URL}/${studentId}`);

            // Update the state to remove the deleted record from the frontend
            setStudents(prev => prev.filter(student => student._id !== studentId));

            Swal.fire("Deleted!", "Your attendance record has been successfully deleted.", "success");
        } catch (err) {
            console.error("Error deleting record:", err);
            Swal.fire("Error!", "Failed to delete your record. Please try again.", "error");
        }
    };


    // ----------------------------------------------------


    // লোডিং স্ক্রিন
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingIndicator />
            </div>
        );
    }

    // এরর স্ক্রিন
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <p className="text-xl font-semibold text-red-700">{error}</p>
            </div>
        );
    }

    // যদি কোনো ডেটা না থাকে
    if (students.length === 0) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
                <p className="text-2xl font-semibold text-gray-500">No attendance records found.</p>
            </div>
        );
    }


    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight leading-tight">
                Student Attendance Overview
            </h2>

            <div className="overflow-x-auto relative shadow-2xl rounded-lg border border-gray-100 animate-fade-in">
                <table className="table table-zebra w-full text-base border-collapse">
                    <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md sticky top-0 z-10">
                        <tr className="[&>th]:py-4 [&>th]:px-6  [&>th]:font-semibold [&>th]:text-lg">
                            <th className="rounded-tl-lg">Student Name</th>
                            <th>Email</th>
                            {subjects.map(subject => (
                                <th key={subject} className="text-center">{subject}</th>
                            ))}
                            <th className="text-center rounded-tr-lg">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student, index) => {
                            // কন্ডিশনাল স্টাইল: যদি নিজের ডেটা হয়, তাহলে হাইলাইট করা
                            const isCurrentUser = user?.email === student.email;

                            return (
                                <tr
                                    key={student._id || index}
                                    className={`group text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-all duration-300 ease-in-out cursor-pointer animate-slide-in-up ${isCurrentUser ? 'bg-indigo-100/50 hover:bg-indigo-100 border-l-4 border-indigo-600' : ''}`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <td className="py-4 px-6 font-medium text-lg">{student.name}</td>
                                    <td className="py-4 px-6 text-sm opacity-80">{student.email}</td>

                                    {subjects.map(subject => (
                                        <td key={subject} className="py-4 px-6 text-center font-semibold">
                                            {getAttendanceStatus(student, subject)}
                                        </td>
                                    ))}

                                    {/* ✅ অ্যাকশন বাটন TD এর ভেতরের স্ট্রাকচার পরিবর্তন করে Edit ও Delete বাটন যোগ করা হয়েছে */}
                                    <td className="py-4 px-6 text-center flex justify-center gap-2">
                                        {/* Edit Button */}
                                        <Link
                                            to={isCurrentUser ? '/updateTable' : '#'} // ইমেইল না মিললে '#' এ নেভিগেট করে
                                            onMouseDown={(e) => {
                                                if (!handleEditClick(student.email)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className={isCurrentUser ? '' : 'pointer-events-auto'}
                                        >
                                            <button
                                                className={`text-sm btn px-3 py-1 rounded-full transition-colors ${isCurrentUser
                                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                    }`}
                                                disabled={!isCurrentUser} // নিজের ডেটা না হলে ডিসেবল করা
                                            >
                                                Edit
                                            </button>
                                        </Link>

                                        {/* ✅ Delete Button */}
                                        <button
                                            className={`text-sm btn px-3 py-1 rounded-full transition-colors ${isCurrentUser
                                                ? 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                }`}
                                            disabled={!isCurrentUser}
                                            // onClick-এ handleDeletClick কল করে student email এবং _id পাস করা হয়েছে
                                            onClick={() => handleDeleteClick(student.email, student._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceTable;