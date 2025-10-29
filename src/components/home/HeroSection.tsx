import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Twitter, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CodeEditor from './CodeEditor';

// GSAP plugin'ini kaydet
gsap.registerPlugin(ScrollTrigger);

type Profil = Database['public']['Tables']['profil']['Row'];

const HeroSection = () => {
  const [profileData, setProfileData] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);
  
  // GSAP refs
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from('profil')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error('Profil verisi çekilemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Apple-style GSAP animasyonları
  useEffect(() => {
    if (!loading && profileData) {
      const ctx = gsap.context(() => {
        // Apple'ın karakteristik giriş animasyonu
        const masterTl = gsap.timeline();

        // İlk yükleme animasyonu - Apple tarzı
        gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current, buttonsRef.current, socialRef.current], {
          y: 60,
          opacity: 0
        });

        gsap.set(imageRef.current, {
          scale: 0.3,
          opacity: 0,
          rotationY: -30
        });

        gsap.set(codeEditorRef.current, {
          x: 200,
          opacity: 0,
          rotationY: 15,
          scale: 0.8
        });

        // Apple'ın signature easing curve'ü
        const appleEase = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

        // Profil resmi - Apple tarzı büyüme efekti
        masterTl.to(imageRef.current, {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 1.4,
          ease: "back.out(1.2)"
        });

        // Başlık - Apple'ın yumuşak slide up efekti
        masterTl.to(titleRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: appleEase
        }, "-=1");

        // Alt başlık
        masterTl.to(subtitleRef.current, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: appleEase
        }, "-=0.8");

        // Açıklama
        masterTl.to(descriptionRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: appleEase
        }, "-=0.6");

        // Butonlar - Apple'ın staggered animation
        masterTl.to(buttonsRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: appleEase
        }, "-=0.4");

        // Sosyal medya
        masterTl.to(socialRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: appleEase
        }, "-=0.2");

        // Code Editor - Apple'ın 3D slide efekti
        masterTl.to(codeEditorRef.current, {
          x: 0,
          opacity: 1,
          rotationY: 0,
          scale: 1,
          duration: 1.5,
          ease: "power3.out"
        }, "-=1.2");

        // Apple'ın signature zoom-out scroll efekti
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1, // Apple'ın ultra-smooth scrub
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Apple'ın ana zoom-out efekti - tüm hero container
            const zoomOutScale = 1 - progress * 0.3; // %30 küçülme
            const zoomOutY = progress * -100; // Yukarı hareket
            
            gsap.to(heroRef.current, {
              scale: zoomOutScale,
              y: zoomOutY,
              transformOrigin: "center center",
              duration: 0.1,
              ease: "none"
            });

            // Background - Apple'ın depth efekti
            gsap.to(backgroundRef.current, {
              scale: 1 + progress * 0.2, // Background büyür (depth illusion)
              opacity: 1 - progress * 0.4,
              duration: 0.1,
              ease: "none"
            });

            // Profil resmi - Apple'ın 3D zoom efekti
            gsap.to(imageRef.current, {
              scale: 1 - progress * 0.4,
              rotationY: progress * -15,
              rotationX: progress * 5,
              z: progress * -200,
              duration: 0.1,
              ease: "none"
            });

            // Başlık - Apple'ın typography zoom efekti
            gsap.to(titleRef.current, {
              scale: 1 - progress * 0.2,
              y: progress * -80,
              opacity: 1 - progress * 0.6,
              rotationX: progress * 10,
              duration: 0.1,
              ease: "none"
            });

            // Alt başlık - staggered zoom
            gsap.to(subtitleRef.current, {
              scale: 1 - progress * 0.25,
              y: progress * -60,
              opacity: 1 - progress * 0.7,
              rotationX: progress * 8,
              duration: 0.1,
              ease: "none"
            });

            // Açıklama - subtle zoom
            gsap.to(descriptionRef.current, {
              scale: 1 - progress * 0.15,
              y: progress * -40,
              opacity: 1 - progress * 0.8,
              duration: 0.1,
              ease: "none"
            });

            // Butonlar - Apple'ın interactive element zoom
            gsap.to(buttonsRef.current, {
              scale: 1 - progress * 0.3,
              y: progress * -30,
              opacity: 1 - progress * 0.9,
              rotationX: progress * 15,
              duration: 0.1,
              ease: "none"
            });

            // Sosyal medya - micro zoom
            gsap.to(socialRef.current, {
              scale: 1 - progress * 0.2,
              y: progress * -20,
              opacity: 1 - progress * 0.95,
              duration: 0.1,
              ease: "none"
            });

            // Code Editor - Apple'ın dramatic 3D zoom
            gsap.to(codeEditorRef.current, {
              scale: 1 - progress * 0.5,
              rotationY: progress * 25,
              rotationX: progress * -10,
              z: progress * -300,
              y: progress * -100,
              opacity: 1 - progress * 0.5,
              duration: 0.1,
              ease: "none"
            });
          }
        });

        // Apple'ın secondary scroll efekti - blur ve brightness
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Apple'ın blur efekti
            const blurAmount = progress * 8;
            const brightness = 1 - progress * 0.3;
            
            gsap.to(heroRef.current, {
              filter: `blur(${blurAmount}px) brightness(${brightness})`,
              duration: 0.1,
              ease: "none"
            });
          }
        });

        // Apple'ın hover mikrointeraksiyonları
        if (imageRef.current) {
          const img = imageRef.current;
          
          img.addEventListener('mouseenter', () => {
            gsap.to(img, {
              scale: 1.08,
              rotationY: 5,
              duration: 0.4,
              ease: "power2.out"
            });
          });

          img.addEventListener('mouseleave', () => {
            gsap.to(img, {
              scale: 1,
              rotationY: 0,
              duration: 0.4,
              ease: "power2.out"
            });
          });
        }

        // Butonlar için Apple hover efekti
        const buttons = buttonsRef.current?.querySelectorAll('a');
        buttons?.forEach(button => {
          button.addEventListener('mouseenter', () => {
            gsap.to(button, {
              scale: 1.05,
              y: -2,
              duration: 0.3,
              ease: "power2.out"
            });
          });

          button.addEventListener('mouseleave', () => {
            gsap.to(button, {
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        });

        // Sosyal medya ikonları için Apple hover
        const socialIcons = socialRef.current?.querySelectorAll('a');
        socialIcons?.forEach(icon => {
          icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
              scale: 1.15,
              rotationZ: 5,
              duration: 0.3,
              ease: "back.out(2)"
            });
          });

          icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
              scale: 1,
              rotationZ: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        });

        // Apple'ın mouse follow efekti
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
          mouseX = (e.clientX - window.innerWidth / 2) * 0.01;
          mouseY = (e.clientY - window.innerHeight / 2) * 0.01;

          gsap.to(codeEditorRef.current, {
            rotationY: mouseX,
            rotationX: -mouseY,
            duration: 0.5,
            ease: "power2.out"
          });

          gsap.to(imageRef.current, {
            rotationY: mouseX * 0.5,
            rotationX: -mouseY * 0.5,
            duration: 0.8,
            ease: "power2.out"
          });
        };

        heroRef.current?.addEventListener('mousemove', handleMouseMove);

        // Cleanup
        return () => {
          heroRef.current?.removeEventListener('mousemove', handleMouseMove);
        };

      }, heroRef);

      return () => ctx.revert();
    }
  }, [loading, profileData]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden will-change-transform"
      style={{ 
        perspective: '3000px',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center'
      }}
    >
      {/* Apple-style Premium Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0"
      >
        {/* Apple'ın signature gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f8f9fa] to-[#f1f3f4] dark:from-[#000000] dark:via-[#0a0a0a] dark:to-[#111111]"></div>
        
        {/* Apple'ın mesh gradient overlay */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-apple-blue/[0.03] via-transparent to-apple-purple/[0.03]"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-apple-blue/[0.02] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-apple-purple/[0.02] rounded-full blur-3xl"></div>
        </div>

        {/* Apple'ın subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="container-custom relative z-10 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center min-h-screen py-24 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Left Content - Apple'ın content hierarchy */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Apple-style Status Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-apple-green/8 text-apple-green rounded-full border border-apple-green/15 backdrop-blur-xl shadow-sm">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-apple-green rounded-full"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-apple-green rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-sm font-medium tracking-wide">Yeni projeler için müsait</span>
            </div>

            {/* Apple-style Profile Image */}
            <div 
              ref={imageRef}
              className="relative w-44 h-44 mx-auto lg:mx-0 cursor-pointer group will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Apple'ın signature glow */}
              <div className="absolute -inset-6 bg-gradient-to-r from-apple-blue/10 via-apple-purple/10 to-apple-blue/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative w-44 h-44 rounded-full overflow-hidden shadow-2xl border border-white/20 dark:border-apple-gray-700/30 backdrop-blur-xl bg-white/5 dark:bg-apple-gray-800/5">
                {loading ? (
                  <div className="w-full h-full bg-gradient-to-br from-apple-gray-100 to-apple-gray-200 dark:from-apple-gray-800 dark:to-apple-gray-700 animate-pulse"></div>
                ) : profileData?.resim_url ? (
                  <img
                    src={profileData.resim_url}
                    alt={profileData.isim}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-apple-blue via-apple-purple to-apple-blue flex items-center justify-center">
                    <span className="text-5xl font-light text-white tracking-wider">
                      {profileData?.isim?.charAt(0) || 'H'}
                    </span>
                  </div>
                )}
                
                {/* Apple'ın glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Apple-style status indicator */}
              <div className="absolute -bottom-3 -right-3 w-9 h-9 bg-apple-green rounded-full border-3 border-white dark:border-apple-gray-900 shadow-lg flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Apple-style Typography Hierarchy */}
            <div className="space-y-8">
              <h1 
                ref={titleRef}
                className="text-7xl md:text-8xl lg:text-9xl font-light text-apple-gray-900 dark:text-white tracking-tighter leading-[0.85] font-system will-change-transform"
                style={{ 
                  fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
                  letterSpacing: '-0.02em',
                  transformStyle: 'preserve-3d'
                }}
              >
                {loading ? 'Hekimcan AKTAŞ' : profileData?.isim || 'Hekimcan AKTAŞ'}
              </h1>
              
              <p 
                ref={subtitleRef}
                className="text-4xl md:text-5xl text-apple-blue font-light tracking-tight leading-tight will-change-transform"
                style={{ 
                  letterSpacing: '-0.01em',
                  transformStyle: 'preserve-3d'
                }}
              >
                {loading ? 'Yazılım Geliştirici' : profileData?.unvan || 'Yazılım Geliştirici'}
              </p>
            </div>

            {/* Apple-style Description */}
            <p
              ref={descriptionRef}
              className="text-2xl md:text-3xl text-apple-gray-600 dark:text-apple-gray-300 leading-relaxed max-w-3xl font-light tracking-wide will-change-transform"
              style={{ 
                lineHeight: '1.4',
                letterSpacing: '0.01em',
                transformStyle: 'preserve-3d'
              }}
            >
              {loading
                ? 'Modern web teknolojileri ile yenilikçi çözümler geliştiriyorum.'
                : profileData?.slogan ||
                  'Modern web teknolojileri ile yenilikçi çözümler geliştiriyorum. Kullanıcı deneyimini ön planda tutan, performanslı ve güvenli yazılımlar oluşturuyorum.'}
            </p>

            {/* Apple-style CTA Buttons */}
            <div 
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-6 pt-4 will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Link
                to="/projeler"
                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-apple-blue text-white rounded-2xl font-medium text-xl shadow-2xl hover:shadow-apple-blue/25 backdrop-blur-xl border border-apple-blue/20 overflow-hidden transition-all duration-500"
              >
                <span className="relative z-10">Projelerimi Keşfet</span>
                <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                
                {/* Apple'ın button shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>
              
              <Link
                to="/iletisim"
                className="group inline-flex items-center gap-4 px-10 py-5 bg-white/60 dark:bg-apple-gray-800/60 text-apple-gray-900 dark:text-white rounded-2xl font-medium text-xl shadow-xl hover:shadow-2xl backdrop-blur-xl border border-apple-gray-200/30 dark:border-apple-gray-700/30 transition-all duration-500"
              >
                <span>İletişime Geç</span>
              </Link>
            </div>

            {/* Apple-style Social Links */}
            <div 
              ref={socialRef}
              className="flex items-center gap-6 pt-8 will-change-transform"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="text-lg text-apple-gray-500 dark:text-apple-gray-400 font-light">Takip edin</span>
              <div className="flex items-center gap-4">
                {profileData?.github_url && (
                  <a
                    href={profileData.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue hover:bg-apple-gray-100/50 dark:hover:bg-apple-gray-800/50 backdrop-blur-xl transition-all duration-300"
                    aria-label="GitHub"
                  >
                    <Github size={28} />
                  </a>
                )}
                {profileData?.linkedin_url && (
                  <a
                    href={profileData.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue hover:bg-apple-gray-100/50 dark:hover:bg-apple-gray-800/50 backdrop-blur-xl transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={28} />
                  </a>
                )}
                {profileData?.twitter_url && (
                  <a
                    href={profileData.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue hover:bg-apple-gray-100/50 dark:hover:bg-apple-gray-800/50 backdrop-blur-xl transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <Twitter size={28} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Apple-style Code Editor */}
          <div className="lg:col-span-5">
            <div 
              ref={codeEditorRef}
              className="relative will-change-transform"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'rotateY(-5deg) rotateX(2deg)'
              }}
            >
              <CodeEditor />
            </div>
          </div>
        </div>
      </div>

      {/* Apple-style Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="w-7 h-12 border-2 border-apple-gray-300 dark:border-apple-gray-600 rounded-full flex justify-center backdrop-blur-sm bg-white/10 dark:bg-apple-gray-900/10">
          <motion.div
            className="w-1.5 h-4 bg-apple-gray-400 dark:bg-apple-gray-500 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <ChevronDown className="w-6 h-6 text-apple-gray-300 dark:text-apple-gray-600" />
      </div>
    </section>
  );
};

export default HeroSection
