import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-extrabold text-primary-600 dark:text-primary-400">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          Sayfa Bulunamadı
        </h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
        </p>
        <div className="mt-6">
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;