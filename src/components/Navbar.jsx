import React, { useState } from 'react';
import { Link, NavLink, useNavigation } from 'react-router';
import useAuth from '../hooks/useAuth';
import { motion, useAnimation } from 'framer-motion';
import Loader from './Loader';
import Swal from 'sweetalert2';

const AnimatedLogo = () => {
    const controls = useAnimation();
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        (async () => {
            await controls.start({ opacity: 1, y: 0, transition: { duration: 0.45 } });
            controls.start('loop');
        })();
    }, [controls]);

    const svgVariants = {
        initial: { opacity: 0, y: -6 },
        loop: {},
    };

    return (
        <motion.div
            className="flex items-center gap-3 cursor-pointer select-none"
            variants={svgVariants}
            initial="initial"
            animate={controls}
            style={{ originX: 0.5 }}
        >
 
            <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0"
            >
                <motion.rect
                    x="3"
                    y="3"
                    width="14"
                    height="18"
                    rx="2"
                    stroke="#2563EB"
                    strokeWidth="1.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 0.95, 1], opacity: [0.8, 1, 0.95, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                />

                <motion.path
                    d="M9 12.5l2.2 2.2L15.5 10"
                    stroke="#06B6D4"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 1] }}
                    transition={{ duration: 1.2, delay: 0.2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                />

                <motion.path
                    d="M7 3h4"
                    stroke="#4F46E5"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    initial={{ y: -2, opacity: 0 }}
                    animate={{ y: [-2, 0, -1, 0], opacity: [0.7, 1, 0.9, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                <motion.circle
                    cx="13"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="rgba(99,102,241,0.06)"
                    strokeWidth="6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.18, 0.08, 0.18, 0], rotate: [0, 12, -8, 6, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
                />
            </motion.svg>

       
            <motion.span
                className="font-bold text-lg sm:text-xl bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 bg-clip-text text-transparent hidden sm:inline-block"
                style={{ display: 'inline-block' }}
                animate={{
                    filter: ['hue-rotate(0deg)', 'hue-rotate(40deg)', 'hue-rotate(0deg)'],
                    scale: [1, 1.02, 1],
                    letterSpacing: ['0px', '1px', '0px'],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
                Attendance Calculator
            </motion.span>
        </motion.div>
    );
};

const Navbar = () => {
    const { user, logOut } = useAuth();
    const navigation = useNavigation();
    const loading = navigation.state === "loading";

    const link = (
        <>
            <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                    Home
                </NavLink>
            </li>
            {user && (
                <>
                    <li>
                        <NavLink to="/createTable" className={({ isActive }) => (isActive ? "active" : "")}>
                            Create Table
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/percentage" className={({ isActive }) => (isActive ? "active" : "")}>
                            Percentage
                        </NavLink>
                    </li>
                </>
            )}
        </>
    );

    const handleLogOut = () => {
        logOut().catch(console.log);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Log Out Successfully",
            showConfirmButton: false,
            timer: 1500
        });
    };

    return (
        <div className="navbar bg-base-100 md:px-24 shadow-sm px-3 relative">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex="0" className="btn btn-ghost lg:hidden p-2" aria-label="Open menu">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </label>
                    <ul tabIndex="0" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow">
                        {link}
                        <div className="divider my-1"></div>
                        {user ? (
                            <div className="px-2 py-1">
                                <div className="flex items-center gap-2">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border-2 border-blue-500" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">U</div>
                                    )}
                                    <div>
                                        <div className="font-medium text-sm">{user.displayName}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                <button onClick={handleLogOut} className="btn btn-sm btn-error mt-3 w-full">
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <li>
                                <Link to="/login" className="btn btn-sm w-full justify-center">
                                    Login / Register
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>

                <Link to="/" className="flex items-center gap-2">
                    <AnimatedLogo />
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">{link}</ul>
            </div>

            <div className="navbar-end gap-3 flex items-center">
                {loading && <Loader />}
                {user ? (
                    <>
                        {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-blue-500" />}
                        <span className="font-semibold text-gray-700 hidden md:inline">{user.displayName}</span>
                        <button onClick={handleLogOut} className="btn bg-red-600 text-white font-bold">
                            Log Out
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn bg-blue-600 !text-white font-bold">
                        Login / Register
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;