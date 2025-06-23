import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { GraduationCap, BookOpen, Award, Calendar, MapPin, Sparkles, Code, Zap } from 'lucide-react';
import EducationTimeline from '../components/education/EducationTimeline';

const EducationPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      if (currentScrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    // Show scroll indicator after 2 seconds
    const timer = setTimeout(() => {
      if (window.scrollY < 100) {
        setShowScrollIndicator(true);
      }
    }, 2000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Eğitim | Hekimcan AKTAŞ</title>
        <meta name="description" content="Hekimcan AKTAŞ'ın eğitim geçmişi ve akademik başarıları" />
      </Helmet>
      
      {/* Hero Section with Premium Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Multi-layer Animated Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
          
          {/* Animated mesh gradient */}
          <motion.div 
            className="absolute inset-0 opacity-40"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 60% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)'
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating 3D Elements */}
        <motion.div
          className="absolute top-20 left-20 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl opacity-10"
          style={{ y: y1 }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div
          className="absolute top-40 right-32 w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 shadow-2xl opacity-10"
          style={{ y: y2 }}
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div
          className="absolute bottom-32 left-40 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 shadow-2xl opacity-10"
          style={{ y: y3 }}
          animate={{
            rotate: [0, -360],
            scale: [1, 1.3, 1]
          }}
          transition={{
            rotate: { duration: 12, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Floating Icons */}
        <motion.div
          className="absolute top-32 left-1/4 text-blue-400/20 dark:text-blue-400/10"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <GraduationCap size={48} />
        </motion.div>

        <motion.div
          className="absolute top-48 right-1/4 text-purple-400/20 dark:text-purple-400/10"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <BookOpen size={40} />
        </motion.div>

        <motion.div
          className="absolute bottom-48 left-1/3 text-pink-400/20 dark:text-pink-400/10"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Award size={44} />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sürekli Öğrenmeye Devam Ediyorum
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Eğitim
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Akademik geçmişim, sürekli öğrenme yolculuğum ve 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              {' '}elde ettiğim başarılar
            </span>
          </motion.p>

          <motion.p
            className="text-lg text-gray-500 dark:text-gray-400 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Teknoloji ve yazılım geliştirme alanındaki eğitim serüvenim
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ${
            showScrollIndicator ? 'block' : 'hidden'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showScrollIndicator ? 1 : 0, y: showScrollIndicator ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full relative">
              <motion.div
                className="w-1 h-2 bg-gray-600 dark:bg-gray-300 rounded-full absolute left-1/2 transform -translate-x-1/2 top-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400 dark:text-gray-500">
                <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 12 12)"/>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      <EducationTimeline />
    </>
  );
};

export default EducationPage;
