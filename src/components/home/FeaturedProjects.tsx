import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Proje = Database['public']['Tables']['projeler']['Row'];

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Proje[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // GSAP refs
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepIndicatorRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const bottomButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projeler')
          .select('*')
          .eq('one_cikan', true)
          .order('created_at', { ascending: false })
          .limit(4); // Apple genelde 4 step gösterir

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Projeler çekilemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Responsive breakpoint kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Apple-style sticky stepper animasyonları
  useEffect(() => {
    if (!loading && projects.length > 0) {
      const ctx = gsap.context(() => {

        // Her proje için scroll trigger - Apple'ın sticky mantığı
        projects.forEach((_, index) => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: `top+=${index * window.innerHeight} top`,
            end: `top+=${(index + 1) * window.innerHeight} top`,
            scrub: false,
            onEnter: () => {
              setCurrentProject(index);
            },
            onEnterBack: () => {
              setCurrentProject(index);
            }
          });
        });

        // Son proje için ekstra görünürlük süresi - son step'in görünebilmesi için
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: `top+=${(projects.length - 1) * window.innerHeight} top`,
          end: `top+=${(projects.length + 0.5) * window.innerHeight} top`, // 0.5 ekran daha bekle
          scrub: false,
          onEnter: () => {
            setCurrentProject(projects.length - 1); // Son projeyi göster
          },
          onEnterBack: () => {
            setCurrentProject(projects.length - 1);
          }
        });

        // Apple-style zoom-out efekti için scroll trigger
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: `top+=${(projects.length + 0.5) * window.innerHeight} top`,
          end: `top+=${(projects.length + 1.5) * window.innerHeight} top`,
          scrub: true, // Smooth zoom-out için scrub true
          onUpdate: (self) => {
            if (stickyContainerRef.current) {
              // Apple'ın zoom-out efekti - scale ve opacity
              const progress = self.progress;
              const scale = 1 - (progress * 0.3); // %30 küçült
              const opacity = 1 - (progress * 0.8); // %80 fade out
              const blur = progress * 20; // Blur efekti

              gsap.set(stickyContainerRef.current, {
                scale: scale,
                opacity: opacity,
                filter: `blur(${blur}px)`,
                transformOrigin: "center center"
              });
            }
          },
          onEnter: () => {
            setCurrentProject(-1); // -1 = son ekran
          },
          onEnterBack: () => {
            setCurrentProject(projects.length - 1);
            // Zoom-out efektini geri al
            if (stickyContainerRef.current) {
              gsap.set(stickyContainerRef.current, {
                scale: 1,
                opacity: 1,
                filter: "blur(0px)"
              });
            }
          }
        });

        // Başlık animasyonu - scroll trigger ile
        gsap.fromTo(titleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        gsap.fromTo(subtitleRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Step indicator animasyonu - sağdan geliyor
        gsap.fromTo(stepIndicatorRef.current,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            delay: 0.8,
            ease: "power3.out"
          }
        );

      }, sectionRef);

      return () => ctx.revert();
    }
  }, [loading, projects]);

  // Aktif proje değiştiğinde animasyon
  useEffect(() => {
    if (!loading && projects.length > 0 && contentRefs.current[currentProject] && imageRefs.current[currentProject]) {
      const ctx = gsap.context(() => {
        // Apple's authentic water drop effect - birebir kopya
        if (bottomButtonRef.current) {
          const tl = gsap.timeline();

          // Phase 1: Ultra smooth shrink to blue dot - Sabit height ve border-radius
          tl.to(bottomButtonRef.current, {
            width: "48px",
            height: "48px",
            borderRadius: "24px", // Height'ın yarısı - mükemmel yuvarlak
            scale: 1,
            backgroundColor: "#007AFF", // Apple Blue
            color: "transparent", // Hide text during transformation
            border: "none",
            boxShadow: "0 0 20px rgba(0, 122, 255, 0.6)",
            duration: 0.8, // Even longer for butter smooth
            ease: "power1.inOut" // Gentlest power curve
          })
            // Phase 2: Subtle breathing pulse - Sabit border-radius
            .to(bottomButtonRef.current, {
              scale: 1.08, // Very subtle scaling
              borderRadius: "24px", // Sabit kalır
              boxShadow: "0 0 30px rgba(0, 122, 255, 0.8)",
              duration: 0.4,
              ease: "sine.inOut" // Sine wave for natural breathing
            })
            .to(bottomButtonRef.current, {
              scale: 1,
              borderRadius: "24px", // Sabit kalır
              boxShadow: "0 0 20px rgba(0, 122, 255, 0.6)",
              duration: 0.4,
              ease: "sine.inOut"
            })
            // Phase 3: Horizontal liquid expansion - Sabit height ve dinamik border-radius
            .to(bottomButtonRef.current, {
              width: "auto",
              height: "48px", // Height sabit kalır
              borderRadius: "24px", // Height'ın yarısı - pill shape için
              scale: 1,
              backgroundColor: "", // Reset to CSS class
              color: "", // Reset to CSS class
              border: "", // Reset to CSS class
              boxShadow: "", // Reset to CSS class
              duration: 1.2, // Extra long for silk-like smoothness
              ease: "power1.out", // Gentlest expansion
              onComplete: () => {
                // Restore original classes after animation
                if (bottomButtonRef.current) {
                  bottomButtonRef.current.className = "inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-apple-gray-800/80 text-apple-gray-900 dark:text-white rounded-full font-medium shadow-apple hover:shadow-apple-lg backdrop-blur-xl border border-apple-gray-200/50 dark:border-apple-gray-700/50 transition-all duration-300 transform hover:scale-[1.02] overflow-hidden";
                }
              }
            });
        }

        // İçerik animasyonu - buton animasyonu ile smooth senkronizasyon
        gsap.fromTo(contentRefs.current[currentProject],
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 1.0, // Longer for smoothness
            ease: "power2.out", // Smoother easing
            delay: 0.8 // Buton animasyonu tamamlandıktan sonra
          }
        );

        // Görsel animasyonu - Ultra smooth
        gsap.fromTo(imageRefs.current[currentProject],
          { opacity: 0, x: 50, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.2, // Longer for ultra smoothness
            ease: "power2.out",
            delay: 1.0 // İçerik animasyonu ile overlap
          }
        );
      });

      return () => ctx.revert();
    }
  }, [currentProject, loading, projects]);

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-apple-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="h-16 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-apple w-96 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-apple w-2/3 mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Apple-style Section Header - Sticky Container Dışında */}
      <div className="py-24 bg-white dark:bg-apple-gray-900">
        <div className="container-custom text-center">
          <h2
            ref={titleRef}
            className="text-6xl md:text-7xl lg:text-8xl font-light text-apple-gray-900 dark:text-white mb-6 tracking-tighter font-system"
            style={{ letterSpacing: '-0.03em' }}
          >
            Öne Çıkan Projeler
          </h2>
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-apple-gray-600 dark:text-apple-gray-400 max-w-4xl mx-auto font-light"
          >
            Modern teknolojiler kullanarak geliştirdiğim çözümler
          </p>
        </div>
      </div>

      <section
        ref={sectionRef}
        className="relative"
        style={{ height: `${(projects.length + 1.5) * 100}vh` }}
      >
        {/* Apple-style Sticky Container - Sadece Proje İçeriği */}
        <div
          ref={stickyContainerRef}
          className="sticky top-0 h-screen bg-white dark:bg-apple-gray-900 overflow-hidden"
        >

          {/* Apple-style Step Indicator - Desktop: Sağ Taraf, Mobile: Üst */}
          {/* Desktop Step Indicator */}
          <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
            <div ref={stepIndicatorRef} className="flex flex-col gap-6">
              {projects.map((_, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => {
                      const targetScroll = index * window.innerHeight;
                      window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                      });
                    }}
                    className={`w-4 h-4 rounded-full transition-all duration-500 ${currentProject === index
                      ? 'bg-apple-blue scale-125 shadow-lg shadow-apple-blue/50'
                      : 'bg-apple-gray-300 dark:bg-apple-gray-600 hover:bg-apple-gray-400 dark:hover:bg-apple-gray-500'
                      }`}
                  />
                  {/* Step Line */}
                  {index < projects.length - 1 && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-px h-12 bg-apple-gray-200 dark:bg-apple-gray-700"></div>
                  )}
                  {/* Step Number */}
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-sm font-medium text-apple-gray-500 dark:text-apple-gray-400">
                    0{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Step Indicator - Üst kısımda yatay */}
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-30 lg:hidden">
            <div className="flex items-center gap-4 px-6 py-3 bg-white/90 dark:bg-apple-gray-800/90 rounded-full backdrop-blur-xl border border-apple-gray-200/50 dark:border-apple-gray-700/50 shadow-apple mobile-step-indicator mobile-dark-optimized ios-optimized">
              {projects.map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const targetScroll = index * window.innerHeight;
                      window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                      });
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${currentProject === index
                      ? 'bg-apple-blue scale-125 shadow-lg shadow-apple-blue/50'
                      : 'bg-apple-gray-300 dark:bg-apple-gray-600'
                      }`}
                  />
                  {/* Mobile Step Line */}
                  {index < projects.length - 1 && (
                    <div className="w-8 h-px bg-apple-gray-200 dark:bg-apple-gray-700"></div>
                  )}
                </div>
              ))}
              <div className="ml-2 text-sm font-medium text-apple-gray-600 dark:text-apple-gray-400">
                {currentProject + 1}/{projects.length}
              </div>
            </div>
          </div>

          {/* Apple-style Main Content Area - Sabit */}
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom mobile-safe-area">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16 items-center min-h-[60vh] px-4 lg:px-0">

                {/* Sol Taraf - Apple Typography */}
                <div className="relative min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[600px] flex flex-col justify-center order-2 lg:order-1">
                  {projects[currentProject] && (
                    <div
                      ref={(el) => (contentRefs.current[currentProject] = el)}
                      className="space-y-12"
                    >
                      {/* Apple-style Project Number */}
                      <div className="relative">
                        <div className="text-[120px] md:text-[200px] lg:text-[300px] font-extralight text-apple-gray-50 dark:text-apple-gray-900 leading-none select-none absolute -top-12 md:-top-20 -left-4 md:-left-8 z-0">
                          0{currentProject + 1}
                        </div>
                        <div className="relative z-10">
                          <div className="text-sm font-medium text-apple-blue uppercase tracking-[0.2em] mb-4">
                            Proje {String(currentProject + 1).padStart(2, '0')}
                          </div>
                        </div>
                      </div>

                      {/* Apple-style Project Title */}
                      <div className="space-y-3 md:space-y-4 lg:space-y-6">
                        <h3
                          className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-light text-apple-gray-900 dark:text-white leading-[0.9] tracking-tight font-system break-words mobile-project-title tablet-project-title desktop-project-title high-dpi-text"
                          style={{
                            fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
                            letterSpacing: '-0.02em'
                          }}
                        >
                          {/* Mobilde daha kısa başlık göster */}
                          {isMobile 
                            ? (projects[currentProject].baslik.length > 25
                                ? `${projects[currentProject].baslik.substring(0, 25)}...`
                                : projects[currentProject].baslik)
                            : (projects[currentProject].baslik.length > 40
                                ? `${projects[currentProject].baslik.substring(0, 40)}...`
                                : projects[currentProject].baslik)
                          }
                        </h3>

                        {/* Apple-style Subtitle/Category */}
                        <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-apple-blue font-light tracking-wide">
                          Web Application
                        </div>
                      </div>

                      {/* Apple-style Description */}
                      <div className="space-y-3 md:space-y-4 lg:space-y-6 max-w-2xl">
                        <p
                          className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-apple-gray-600 dark:text-apple-gray-300 font-light leading-relaxed mobile-project-description tablet-project-description desktop-project-description high-dpi-text mobile-text-select"
                          style={{
                            lineHeight: '1.4',
                            letterSpacing: '0.01em'
                          }}
                        >
                          {/* Mobilde daha kısa açıklama göster */}
                          {isMobile 
                            ? (projects[currentProject].aciklama.length > 80
                                ? `${projects[currentProject].aciklama.substring(0, 80)}...`
                                : projects[currentProject].aciklama)
                            : (projects[currentProject].aciklama.length > 120
                                ? `${projects[currentProject].aciklama.substring(0, 120)}...`
                                : projects[currentProject].aciklama)
                          }
                        </p>
                      </div>

                      {/* Apple-style Tech Stack */}
                      <div className="space-y-2 md:space-y-3 lg:space-y-4">
                        <h4 className="text-sm md:text-base lg:text-lg font-medium text-apple-gray-700 dark:text-apple-gray-300 uppercase tracking-wide">
                          Teknolojiler
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3">
                          {/* Mobilde daha az teknoloji göster */}
                          {projects[currentProject].teknolojiler.slice(0, isMobile ? 3 : 5).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-5 lg:py-2.5 bg-apple-gray-100/80 dark:bg-apple-gray-800/80 text-apple-gray-800 dark:text-apple-gray-200 rounded-full text-xs sm:text-sm lg:text-base font-medium backdrop-blur-sm border border-apple-gray-200/50 dark:border-apple-gray-700/50 whitespace-nowrap mobile-tech-tag high-dpi-border"
                            >
                              {tech}
                            </span>
                          ))}
                          {projects[currentProject].teknolojiler.length > (isMobile ? 3 : 5) && (
                            <span className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-5 lg:py-2.5 bg-apple-gray-100/50 dark:bg-apple-gray-800/50 text-apple-gray-500 dark:text-apple-gray-500 rounded-full text-xs sm:text-sm lg:text-base font-medium backdrop-blur-sm border border-apple-gray-200/30 dark:border-apple-gray-700/30 whitespace-nowrap">
                              +{projects[currentProject].teknolojiler.length - (isMobile ? 3 : 5)} daha
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Apple-style Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 pt-4 md:pt-6 lg:pt-8">
                        {projects[currentProject].canli_demo_url && (
                          <a
                            href={projects[currentProject].canli_demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 bg-apple-blue text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-medium text-sm sm:text-base lg:text-lg xl:text-xl shadow-apple hover:shadow-apple-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] min-h-[44px] touch-manipulation mobile-touch-button touch-button ios-button touch-no-hover"
                          >
                            <span className="whitespace-nowrap">Projeyi İncele</span>
                            <ExternalLink size={16} className="sm:size-[18px] lg:size-[20px] xl:size-[22px] group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                          </a>
                        )}

                        {projects[currentProject].github_url && (
                          <a
                            href={projects[currentProject].github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white/80 dark:bg-apple-gray-800/80 text-apple-gray-900 dark:text-white rounded-lg sm:rounded-xl lg:rounded-2xl font-medium text-sm sm:text-base lg:text-lg xl:text-xl shadow-apple hover:shadow-apple-lg border border-apple-gray-200/50 dark:border-apple-gray-700/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] min-h-[44px] touch-manipulation mobile-touch-button touch-button ios-button touch-no-hover high-dpi-border"
                          >
                            <span className="whitespace-nowrap">Kaynak Kodu</span>
                            <Github size={16} className="sm:size-[18px] lg:size-[20px] xl:size-[22px] group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sağ Taraf - Apple-style Project Visual */}
                <div className="relative min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[600px] flex items-center justify-center order-1 lg:order-2">
                  {projects[currentProject] && (
                    <div
                      ref={(el) => (imageRefs.current[currentProject] = el)}
                      className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                    >
                      {/* Apple-style Ambient Glow */}
                      <div className="absolute -inset-8 bg-gradient-to-r from-apple-blue/8 via-apple-purple/8 to-apple-blue/8 rounded-[2rem] blur-3xl opacity-80"></div>

                      {/* Apple-style Device Frame */}
                      <div className="relative">
                        {/* Main Image Container */}
                        <div className="relative overflow-hidden rounded-[1.5rem] shadow-2xl bg-white dark:bg-apple-gray-800 border border-apple-gray-200/20 dark:border-apple-gray-700/20">

                          {/* Browser Chrome (Optional) */}
                          <div className="h-8 bg-apple-gray-100 dark:bg-apple-gray-700 flex items-center px-4 border-b border-apple-gray-200/50 dark:border-apple-gray-600/50">
                            <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                            </div>
                            <div className="flex-1 text-center">
                              <div className="text-xs text-apple-gray-500 dark:text-apple-gray-400 font-medium">
                                {projects[currentProject].baslik}
                              </div>
                            </div>
                          </div>

                          {/* Project Image */}
                          <div className="relative">
                            <img
                              src={projects[currentProject].gorsel_url}
                              alt={projects[currentProject].baslik}
                              className="w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[400px] xl:h-[480px] object-cover object-top mobile-project-image mobile-optimized"
                              loading="lazy"
                            />

                            {/* Apple-style Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10"></div>
                          </div>
                        </div>

                        {/* Apple-style Floating Elements */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-apple-blue/10 rounded-full blur-xl animate-pulse-subtle"></div>
                        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-apple-purple/10 rounded-full blur-xl animate-float"></div>
                      </div>

                      {/* Apple-style Quick Actions - Desktop only */}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 gap-4 hidden lg:flex">
                        {projects[currentProject].github_url && (
                          <a
                            href={projects[currentProject].github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-4 bg-white/90 dark:bg-apple-gray-800/90 rounded-2xl shadow-apple hover:shadow-apple-lg text-apple-gray-700 dark:text-apple-gray-300 hover:text-apple-blue backdrop-blur-xl border border-apple-gray-200/50 dark:border-apple-gray-700/50 transition-all duration-300 transform hover:scale-110 active:scale-95"
                            aria-label="GitHub Repository"
                          >
                            <Github size={24} className="group-hover:rotate-12 transition-transform duration-300" />
                          </a>
                        )}
                        {projects[currentProject].canli_demo_url && (
                          <a
                            href={projects[currentProject].canli_demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-4 bg-apple-blue text-white rounded-2xl shadow-apple hover:shadow-apple-lg backdrop-blur-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                            aria-label="Live Demo"
                          >
                            <ExternalLink size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Apple-style Bottom Navigation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <Link
              ref={bottomButtonRef}
              to="/projeler"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-apple-gray-800/80 text-apple-gray-900 dark:text-white rounded-full font-medium shadow-apple hover:shadow-apple-lg backdrop-blur-xl border border-apple-gray-200/50 dark:border-apple-gray-700/50 transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
            >
              <span>Tüm Projeleri Gör</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


    </>
  );
};

export default FeaturedProjects;
