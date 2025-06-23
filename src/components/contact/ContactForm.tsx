import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { CheckCircle, Send, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

type FormValues = {
  isim: string;
  email: string;
  mesaj: string;
};

// Mouse Following Button Component
const MouseFollowButton = ({ children, onClick, disabled, type = "button" }: any) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      setMousePosition({ x, y });
      mouseX.set(x * 0.1);
      mouseY.set(y * 0.1);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full overflow-hidden rounded-xl p-4 font-semibold text-white transition-all duration-300 ${
        disabled ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY
      }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
            'linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6)',
            'linear-gradient(45deg, #ec4899, #3b82f6, #8b5cf6)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
        }}
      />
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(59, 130, 246, 0.4)',
            '0 0 0 10px rgba(59, 130, 246, 0)',
            '0 0 0 0 rgba(59, 130, 246, 0)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('iletisim')
        .insert([{ 
          isim: data.isim,
          email: data.email,
          mesaj: data.mesaj,
          okundu: false
        }]);
      
      if (error) throw error;
      
      setIsSuccess(true);
      reset();
      toast.success('Mesajınız başarıyla gönderildi!');
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      toast.error('Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Glassmorphism container */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-[1px]">
          <div className="w-full h-full rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl" />
        </div>
        
        <div className="relative z-10">
          <motion.h3 
            className="text-3xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              İletişim Formu
            </span>
          </motion.h3>
          
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm"
            >
              {/* Confetti particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, Math.random() * 200 - 100],
                      y: [0, Math.random() * -100]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '50%'
                    }}
                  />
                ))}
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                    Mesajınız başarıyla gönderildi!
                  </h4>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    En kısa sürede size geri dönüş yapacağım.
                  </p>
                </div>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="flex-shrink-0 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <label htmlFor="isim" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                İsim
              </label>
              <div className="relative">
                <input
                  id="isim"
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    errors.isim 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                  }`}
                  {...register('isim', { required: 'İsim alanı zorunludur' })}
                />
                {/* Focus glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 focus-within:opacity-100 pointer-events-none" />
              </div>
              {errors.isim && (
                <motion.p 
                  className="mt-2 text-sm text-red-500"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {errors.isim.message}
                </motion.p>
              )}
            </motion.div>
            
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                E-posta
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                  }`}
                  {...register('email', { 
                    required: 'E-posta alanı zorunludur',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Geçerli bir e-posta adresi girin'
                    }
                  })}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 focus-within:opacity-100 pointer-events-none" />
              </div>
              {errors.email && (
                <motion.p 
                  className="mt-2 text-sm text-red-500"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>
            
            {/* Message Field */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label htmlFor="mesaj" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Mesajınız
              </label>
              <div className="relative">
                <textarea
                  id="mesaj"
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm resize-none transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    errors.mesaj 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                  }`}
                  {...register('mesaj', { 
                    required: 'Mesaj alanı zorunludur',
                    minLength: {
                      value: 10,
                      message: 'Mesajınız en az 10 karakter olmalıdır'
                    }
                  })}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 focus-within:opacity-100 pointer-events-none" />
              </div>
              {errors.mesaj && (
                <motion.p 
                  className="mt-2 text-sm text-red-500"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {errors.mesaj.message}
                </motion.p>
              )}
            </motion.div>
            
            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <MouseFollowButton
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Mesaj Gönder
                    <Sparkles size={16} className="animate-pulse" />
                  </>
                )}
              </MouseFollowButton>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactForm;
