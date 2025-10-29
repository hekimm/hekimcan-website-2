import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
    const [step, setStep] = useState<'email' | 'password'>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('E-posta adresi gerekli');
            return;
        }

        setError('');
        setLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Geçerli bir e-posta adresi girin');
            setLoading(false);
            return;
        }

        setTimeout(() => {
            setStep('password');
            setLoading(false);
        }, 500);
    };

    const handlePasswordSubmit = async () => {
        if (!password.trim()) {
            setError('Şifre gerekli');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError('E-posta veya şifre hatalı');
                return;
            }

            if (data.user) {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError('Giriş yapılırken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setStep('email');
        setPassword('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] flex items-center justify-center p-4">
            <div className="w-full max-w-[440px]">
                {/* Ana Sayfaya Dön */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6"
                >
                    <a
                        href="/"
                        className="inline-flex items-center text-[#0066cc] dark:text-[#2997ff] hover:text-[#0077ed] dark:hover:text-[#409cff] transition-colors text-[14px]"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        Ana Sayfaya Dön
                    </a>
                </motion.div>

                {/* Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-[#1d1d1f] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-8 md:p-10"
                >
                    {/* Başlık */}
                    <div className="text-center mb-8">
                        <h1 className="text-[28px] md:text-[32px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2 tracking-tight">
                            Admin Hesabı ile giriş yapın
                        </h1>
                    </div>

                    {/* Login Form */}
                    <AnimatePresence mode="wait">
                        {step === 'email' ? (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <form onSubmit={handleEmailSubmit} className="space-y-6">
                                    {/* Email Input */}
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-[52px] px-4 pr-14 bg-white dark:bg-[#2d2d2d] border-[3px] border-[#0071e3] dark:border-[#0a84ff] rounded-[12px] text-[17px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#98989d] focus:outline-none focus:border-[#0077ed] dark:focus:border-[#409cff] transition-colors"
                                            placeholder="E-posta veya Telefon Numarası"
                                            autoFocus
                                            disabled={loading}
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading || !email.trim()}
                                            className="absolute right-[6px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] bg-[#e8e8ed] dark:bg-[#424245] hover:bg-[#d2d2d7] dark:hover:bg-[#525255] disabled:opacity-40 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all"
                                        >
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-[#86868b] dark:border-[#98989d] border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <svg className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-[#d60000] dark:text-[#ff453a] text-[14px] text-center"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    {/* Checkbox */}
                                    <div className="flex items-center justify-center pt-8">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={keepSignedIn}
                                                onChange={(e) => setKeepSignedIn(e.target.checked)}
                                                className="w-[18px] h-[18px] border-2 border-[#d2d2d7] dark:border-[#424245] rounded-[4px] text-[#0071e3] dark:text-[#0a84ff] focus:ring-0 focus:ring-offset-0 cursor-pointer bg-white dark:bg-[#2d2d2d]"
                                            />
                                            <span className="ml-2 text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                                                Oturum açık kalsın
                                            </span>
                                        </label>
                                    </div>

                                    {/* Forgot Password Link */}
                                    <div className="text-center pt-4">
                                        <a
                                            href="#"
                                            className="text-[#0066cc] dark:text-[#2997ff] hover:text-[#0077ed] dark:hover:text-[#409cff] text-[14px] inline-flex items-center gap-1 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                console.log('Şifre sıfırlama');
                                            }}
                                        >
                                            Parolayı mı unuttunuz?
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="password"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Back Button */}
                                <button
                                    onClick={handleBackToEmail}
                                    className="flex items-center text-[#0066cc] dark:text-[#2997ff] hover:text-[#0077ed] dark:hover:text-[#409cff] transition-colors mb-6 text-[14px]"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Geri
                                </button>

                                {/* User Info */}
                                <div className="flex items-center mb-6 pb-4 border-b border-[#d2d2d7] dark:border-[#424245]">
                                    <div className="w-[48px] h-[48px] bg-[#e8e8ed] dark:bg-[#424245] rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-6 h-6 text-[#86868b] dark:text-[#98989d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[12px] text-[#86868b] dark:text-[#98989d]">Şifre girin</p>
                                        <p className="text-[17px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{email}</p>
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-6">
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && password.trim()) {
                                                    handlePasswordSubmit();
                                                }
                                            }}
                                            className="w-full h-[52px] px-4 bg-white dark:bg-[#2d2d2d] border-[3px] border-[#0071e3] dark:border-[#0a84ff] rounded-[12px] text-[17px] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#98989d] focus:outline-none focus:border-[#0077ed] dark:focus:border-[#409cff] transition-colors"
                                            placeholder="Şifre"
                                            autoFocus
                                            disabled={loading}
                                        />
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-[#d60000] dark:text-[#ff453a] text-[14px] text-center"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    {/* Checkbox */}
                                    <div className="flex items-center">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={keepSignedIn}
                                                onChange={(e) => setKeepSignedIn(e.target.checked)}
                                                className="w-[18px] h-[18px] border-2 border-[#d2d2d7] dark:border-[#424245] rounded-[4px] text-[#0071e3] dark:text-[#0a84ff] focus:ring-0 focus:ring-offset-0 cursor-pointer bg-white dark:bg-[#2d2d2d]"
                                            />
                                            <span className="ml-2 text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7]">
                                                Oturum açık kalsın
                                            </span>
                                        </label>
                                    </div>

                                    {/* Login Button */}
                                    <button
                                        onClick={handlePasswordSubmit}
                                        disabled={loading || !password.trim()}
                                        className="w-full h-[52px] bg-[#0071e3] dark:bg-[#0a84ff] hover:bg-[#0077ed] dark:hover:bg-[#409cff] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[17px] font-medium rounded-[12px] transition-all flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            'Giriş Yap'
                                        )}
                                    </button>

                                    {/* Forgot Password Link */}
                                    <div className="text-center pt-2">
                                        <a
                                            href="#"
                                            className="text-[#0066cc] dark:text-[#2997ff] hover:text-[#0077ed] dark:hover:text-[#409cff] text-[14px] inline-flex items-center gap-1 transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                console.log('Şifre sıfırlama');
                                            }}
                                        >
                                            Parolayı mı unuttunuz?
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
