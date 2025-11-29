// src/pages/Login.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router'; 
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';

const Login = () => {
    const navigate=useNavigate()
    const { signInUser, signInGoogle }=useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onTouched' });

    const handleLogin = (data) => {
        signInUser(data.email, data.password).then(res => {
            console.log(res.user);
            Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Successfully Logged In",
                        showConfirmButton: false,
                        timer: 1500
                    });
            navigate('/')
        }).catch(error => {
            console.log(error);

        })
    };

    const handleGoogleLogin = () => {
        signInGoogle().then(res => {
            console.log(res.user);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Successfully Logged In",
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/')
        }).catch(error => {
            console.log(error);

        })
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue-100 to-purple-100 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md transform transition-transform duration-500 hover:scale-[1.02]">
                <h2 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-purple-600">
                    🔐 User Login
                </h2>

                {/* IMPORTANT: handleSubmit wrapper */}
                <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            <input
                                type="email"
                                {...register('email', { required: true })}
                                placeholder="example@email.com"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                            />
                        </div>
                        {errors.email?.type === 'required' && (
                            <p className="text-red-500 text-sm mt-1">Please enter the email</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            <input
                                type="password"
                                {...register('password', {
                                    required: true,
                                    minLength: 6, // corrected
                                    pattern: /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/,
                                })}
                                placeholder="Enter Password"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                            />
                        </div>

                        {errors.password?.type === 'required' && (
                            <p className="text-red-500 text-sm mt-1">Please enter the password</p>
                        )}
                        {errors.password?.type === 'minLength' && (
                            <p className="text-red-500 text-sm mt-1">Password must contain at least 6 characters</p>
                        )}
                        {errors.password?.type === 'pattern' && (
                            <p className="text-red-500 text-sm mt-1">Password must contain 1 capital letter and 1 small letter</p>
                        )}
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg"
                    >
                        Login
                    </button>

                    {/* OR divider */}
                    <div className="flex items-center justify-center space-x-2">
                        <span className="h-px w-1/3 bg-gray-300"></span>
                        <span className="text-gray-500 font-medium">OR</span>
                        <span className="h-px w-1/3 bg-gray-300"></span>
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    >
                        <FcGoogle className="w-5 h-5" /> Login with Google
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-gray-500 mt-4">
                        Don’t have an account?{' '}
                        <Link to="/registration" className="text-blue-600 font-semibold hover:underline">
                            Please register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
