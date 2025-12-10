import React, { useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await axios.post('/auth/forgotpassword', { email });
            setMessage('Email sent! Check your inbox.');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send email');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-green-500">I Forgot My Password</h2>
                {message && <div className="bg-green-600 p-3 rounded mb-4 text-center">{message}</div>}
                {error && <div className="bg-red-600 p-3 rounded mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 py-2 rounded font-semibold hover:bg-green-700 transition">
                        Send Reset Link
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm text-gray-400 hover:text-white">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
