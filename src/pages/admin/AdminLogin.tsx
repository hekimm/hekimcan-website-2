import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSupabase } from '../../context/SupabaseContext';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type FormValues = {
  email: string;
  password: string;
};

const AdminLogin = () => {
  const { signIn, session } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const { 
    register, 
    handleSubmit,
    formState: { errors } 
  } = useForm<FormValues>();

  // Eğer zaten giriş yapılmışsa dashboard'a yönlendir
  if (session) {
    navigate('/admin');
    return null;
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await signIn(data.email, data.password);
      
      if (result?.error) {
        throw new Error(result.error.message);
      }
      
      toast.success('Başarıyla giriş yapıldı');
      navigate('/admin');
    } catch (error) {
      console.error('Giriş hatası:', error);
      toast.error('Giriş yapılamadı. E-posta veya şifrenizi kontrol edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Giriş | Hekimcan AKTAŞ</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <motion.div 
            className="absolute top-20 -left-20 w-72 h-72 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-800/10 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors shadow-lg"
          aria-label={theme === 'dark' ? 'Açık moda geç' : 'Koyu moda geç'}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {/* Back to Site */}
        <a 
          href="/"
          className="absolute top-4 left-4 p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors shadow-lg flex items-center"
        >
          <ArrowLeft size={24} />
          <span className="ml-2 hidden sm:inline">Siteye Dön</span>
        </a>
        
        <motion.div 
          className="relative w-full max-w-md mx-auto p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Login Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <Lock size={32} />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Girişi
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Portfolyo yönetim paneline erişmek için giriş yapın
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-posta
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                    errors.email 
                      ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
                  } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:text-white transition-colors`}
                  {...register('email', { 
                    required: 'E-posta alanı zorunludur',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Geçerli bir e-posta adresi girin'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-error-500 dark:text-error-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                      errors.password 
                        ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
                    } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:text-white transition-colors`}
                    {...register('password', { 
                      required: 'Şifre alanı zorunludur',
                      minLength: {
                        value: 6,
                        message: 'Şifre en az 6 karakter olmalıdır'
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-error-500 dark:text-error-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-white font-medium rounded-xl shadow-lg shadow-primary-600/25 transition-all duration-300 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Giriş Yapılıyor...
                  </>
                ) : 'Giriş Yap'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;