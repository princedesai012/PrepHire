// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { forgotPasswordRequest } from '../api/auth.api';
import Footer from '../components/Footer';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const data = await forgotPasswordRequest(email);
            setMessage(data.message);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-6 text-primary">Forgot Password</h1>
                    <p className="mb-4 text-muted-foreground">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring transition"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-xl transition-all duration-300 hover:bg-opacity-90">
                            Send Reset Link
                        </button>
                    </form>
                    {message && <p className="mt-4 text-green-500">{message}</p>}
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;