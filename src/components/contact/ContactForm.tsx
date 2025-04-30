import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CheckCircle, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

type FormValues = {
  isim: string;
  email: string;
  mesaj: string;
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
      
      // 5 saniye sonra başarılı durumunu sıfırla
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
    <div className="card p-6 md:p-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        İletişim Formu
      </h3>
      
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success-50 text-success-900 dark:bg-success-900/20 dark:text-success-50 p-4 rounded-lg mb-6 flex items-start"
        >
          <CheckCircle className="flex-shrink-0 mt-0.5 mr-3" size={20} />
          <div className="flex-1">
            <p className="font-medium">Mesajınız başarıyla gönderildi!</p>
            <p className="mt-1 text-sm opacity-80">En kısa sürede size geri dönüş yapacağım.</p>
          </div>
          <button 
            onClick={() => setIsSuccess(false)}
            className="flex-shrink-0 text-success-900/60 dark:text-success-50/60 hover:text-success-900 dark:hover:text-success-50"
          >
            <X size={18} />
          </button>
        </motion.div>
      ) : null}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="isim" className="form-label">
              İsim
            </label>
            <input
              id="isim"
              type="text"
              className={`form-input ${errors.isim ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              {...register('isim', { required: 'İsim alanı zorunludur' })}
            />
            {errors.isim && (
              <p className="mt-1 text-sm text-error-500 dark:text-error-400">
                {errors.isim.message}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="form-label">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              {...register('email', { 
                required: 'E-posta alanı zorunludur',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Geçerli bir e-posta adresi girin'
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-500 dark:text-error-400">
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="mesaj" className="form-label">
              Mesajınız
            </label>
            <textarea
              id="mesaj"
              rows={5}
              className={`form-input resize-none ${errors.mesaj ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
              {...register('mesaj', { 
                required: 'Mesaj alanı zorunludur',
                minLength: {
                  value: 10,
                  message: 'Mesajınız en az 10 karakter olmalıdır'
                }
              })}
            ></textarea>
            {errors.mesaj && (
              <p className="mt-1 text-sm text-error-500 dark:text-error-400">
                {errors.mesaj.message}
              </p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary w-full flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Gönder
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;