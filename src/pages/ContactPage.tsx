import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Mail, MessageCircle, Send, Sparkles, Zap, Code, ChevronDown } from 'lucide-react';
import ContactForm from '../components/contact/ContactForm';
import ContactInfo from '../components/contact/ContactInfo';

const ContactPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Show scroll indicator after 2 seconds
    const timer = setTimeout(() => {
      setShowScrollIndicator(true);
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <Helmet>
        <title>İletişim | Hekimcan AKTAŞ</title>
        <meta name="description" content="Hekimcan AKTAŞ ile iletişime geçin. Proje teklifleri, iş birlikleri ve sorularınız için iletişim formu." />
      </Helmet>
      
      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Multi-layer Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
          
          {/* Animated mesh gradients */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 40% 80%, #ec4899 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 20% 80%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 60% 20%, #ec4899 0%, transparent 50%)',
                'radial-gradient(circle at 40% 20%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 60% 80%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 20% 50%, #ec4899 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          {/* Mouse-following gradient */}
          <motion.div
            className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.2) 50%, rgba(236,72,153,0.1) 100%)',
              x: springX,
              y: springY,
              translateX: '-50%',
              translateY: '-50%'
            }}
          />
        </div>

        {/* Floating 3D Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[Mail, MessageCircle, Send, Sparkles, Zap, Code].map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute text-blue-500/20 dark:text-blue-400/20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0]
              }}
              transition={{
                duration: 6 + index,
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeInOut"
              }}
              style={{
                left: `${10 + index * 15}%`,
                top: `${20 + index * 10}%`,
                fontSize: `${2 + index * 0.5}rem`
              }}
            >
              <Icon size={40 + index * 8} />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glassmorphism container */}
            <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl p-8 md:p-12 border border-white/20 dark:border-white/10 shadow-2xl">
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-[1px]">
                <div className="w-full h-full rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl" />
              </div>
              
              <div className="relative z-10">
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold mb-6"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                    İletişim
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Proje teklifleri, iş birlikleri veya sorularınız için{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                    benimle iletişime geçin
                  </span>
                </motion.p>

                {/* Status badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium backdrop-blur-sm border border-green-200/50 dark:border-green-700/50"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Yeni projeler için müsait
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mouse Scroll Indicator */}
        {showScrollIndicator && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 2 }}
          >
            <div className="relative">
              <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center">
                <motion.div
                  className="w-1 h-3 bg-gray-600 dark:bg-gray-400 rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
            <ChevronDown 
              size={20} 
              className="animate-bounce"
            />
            <span className="text-sm font-medium">SCROLL</span>
          </motion.div>
        )}
      </div>
      
      {/* Contact Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" />
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
