import React from 'react';
import { User, Mail, Lock, Image } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const Registration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = useAuth()
    const navigate = useNavigate()

  const handleRegistration = (data) => {
    console.log('Form Data:', data);
    const profileImg = data.photo[0];

    registerUser(data.email, data.password)
        .then(res => {
            // ... Successful registration code (same as before) ...
            
            console.log(res.user);
            const formData = new FormData();
            formData.append('image', profileImg);
            const image_Api_Url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEURL}`;
            
            axios.post(image_Api_Url, formData)
                .then(res => {
                    const updateProfile = {
                        displayName: data.name,
                        photoURL: res.data.data.url
                    };
                    updateUserProfile(updateProfile).then().catch(error => {
                        console.log(error);
                    });
                });
            
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: " User Registered Successfully",
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/');
        })
        .catch(error => {
            console.log(error); // Log the full error object for debugging

            // 💡 Check the error code or message to see if the email is already in use
            // The Firebase code for 'email already in use' is 'auth/email-already-in-use'
            if (error.code === 'auth/email-already-in-use') {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: 'This email is already registered. Please use a different email or log in.',
                    confirmButtonText: 'Try Again'
                });
            } else {
                // Handle other potential errors (e.g., weak password, network error)
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occurred',
                    text: error.message || 'Something went wrong during registration.',
                    confirmButtonText: 'OK'
                });
            }
        });
};

    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-fade-in">
                <h2 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                    📝 User Registration
                </h2>

                <form onSubmit={handleSubmit(handleRegistration)} className="space-y-6">

                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Your Name</label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                {...register('name', { required: true })}
                                placeholder="Enter your username"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                            />
                        </div>
                        {errors.name?.type === 'required' && <p className="text-red-500 mt-1">Name is required</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Email</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                {...register('email', { required: true })}
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 transition-all duration-200"
                            />
                        </div>
                        {errors.email?.type === 'required' && <p className="text-red-500 mt-1">Email is required</p>}
                    </div>

                    {/* Photo URL */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Photo URL</label>
                        <div className="relative">
                            <Image className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="file"
                                {...register('photo', { required: true })}
                                className="file-input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 transition-all duration-200"
                            />
                        </div>
                        {errors.photo?.type === 'required' && <p className="text-red-500 mt-1">Photo is required</p>}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-1">Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                {...register('password', { required: true, minLength: 6, pattern: /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/ })}
                                placeholder="Enter password"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 transition-all duration-200"
                            />
                        </div>
                        {errors.password?.type === 'required' && <p className="text-red-500 mt-1">Password is required</p>}
                        {errors.password?.type === 'minLength' && <p className="text-red-500 mt-1">Password must be at least 6 characters</p>}
                        {errors.password?.type === 'pattern' && <p className="text-red-500 mt-1">Password must contain 1 small letter and 1 capital letter</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            className="w-full py-3 text-xl font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                        >
                            Register
                        </button>
                    </div>
                    <p className="text-center text-gray-500 mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Please Login
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Registration;
