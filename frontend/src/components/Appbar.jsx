import React from "react"
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export const Appbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="shadow h-16 flex justify-between">
            <div className="flex items-center space-x-3 text-xl font-bold text-gray-800">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-map text-blue-600"
                >
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" x2="9" y1="3" y2="18" />
                    <line x1="15" x2="15" y1="6" y2="21" />
                </svg>
                <span className="text-xl tracking-tight">Synergy Sphere</span>
            </div>

            <div className="flex items-center">
                <div
                    className={`h-10 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-50 hover:text-blue-500 ${
                        location.pathname === "/Home" ? "bg-blue-500 text-white" : "text-black"
                    }`}
                    onClick={() => navigate("/Home")}
                >
                    <button className="h-full w-full">Home</button>
                </div>
               
                <div
                    className={`h-10 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-50 hover:text-blue-500 ${
                        location.pathname === "/leaderboard" ? "bg-blue-500 text-white" : "text-black"
                    }`}
                    onClick={() => navigate("/solution")}
                >
                    <button className="h-full w-full">Solution</button>
                </div>
                <div
                    className={`h-10 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-50 hover:text-blue-500 ${
                        location.pathname === "/dashboard" ? "bg-blue-500 text-white" : "text-black"
                    }`}
                    onClick={() => navigate("/dashboard")}
                >
                    <button className="h-full w-full">Dashboard</button>
                </div>
                <div
                    className={`h-10 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-50 hover:text-blue-500 ${
                        location.pathname === "/signin" ? "bg-blue-500 text-white" : "text-black"
                    }`}
                    onClick={() => navigate("/signin")}
                >
                    <button className="h-full w-full">Login</button>
                </div>
                <div
                    className={`h-10 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-50 hover:text-blue-500 ${
                        location.pathname === "/" ? "bg-blue-500 text-white" : "text-black"
                    }`}
                    onClick={() => navigate("/")}
                >
                    <button className="h-full w-full">Sign-up</button>
                </div>
            </div>
        </div>
    );
};
