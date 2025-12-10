import React, { useState } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth(); // We might manually log them in if logic supports it

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            const { data } = await axios.put(`/auth/resetpassword/${resetToken}`, { password });
            setSuccess('Password reset success! Redirecting...');

            // Should usually auto-login or redirect to login.
            // Backend returns token, so auto-login possible?
            // For now, let's redirect to login for simplicity / security flow.
            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-green-500">Reset Password</h2>
                {error && <div className="bg-red-600 p-3 rounded mb-4 text-center">{error}</div>}
                {success && <div className="bg-green-600 p-3 rounded mb-4 text-center">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 focus:outline-none"
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-green-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 py-2 rounded font-semibold hover:bg-green-700 transition">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
