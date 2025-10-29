import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowRight, Mail, Phone, MapPin, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Stepper from '../components/ui/Stepper';

gsap.registerPlugin(ScrollTrigger);

const ContactPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentContactMethod, setCurrentContactMethod] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Stepper steps
  const steps = [
    'İletişim Bilgileri',
    'Proje Detayları',
    'Mesaj',
    'Gönder'
  ];

  // Apple GSAP refs
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const contactCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);

  // Apple'ın contact bilgileri
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Proje teklifleri ve iş birlikleri için",
      value: "hekimcanaktas@gmail.com",
      action: "mailto:hekimcanaktas@gmail.com"
    },
    {
      icon: Phone,
      title: "Telefon",
      description: "Acil durumlar ve hızlı görüşmeler için",
      value: "+90 531 905 02 75",
      action: "tel:+905319050275"
    },
    {
      icon: MapPin,
      title: "Konum",
      description: "Yüz yüze görüşmeler için",
      value: "İzmir, TR",
      action: "#"
    }
  ];

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setCurrentStep(0); // Reset to first step
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  // Validation functions
  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.name.trim() !== '' && formData.email.trim() !== '';
      case 1:
        return formData.subject.trim() !== '';
      case 2:
        return formData.message.trim() !== '';
      default:
        return true;
    }
  };

  // Apple GSAP animasyonları
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1️⃣ Hero animasyonları - Apple intro timeline
      const heroTl = gsap.timeline();

      heroTl
        .fromTo(titleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }
        )
        .fromTo(subtitleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
          "-=0.8"
        );

      // CTA'lar 0.2s gecikmeyle float in
      ctaRefs.current.forEach((cta, index) => {
        if (cta) {
          gsap.fromTo(cta,
            { y: 30, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              delay: 1.2 + (index * 0.2),
              ease: "cubic-bezier(0.22, 1, 0.36, 1)"
            }
          );
        }
      });

      // 2️⃣ Apple-style sticky stepper animasyonları (FeaturedProjects benzeri)
      contactMethods.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: formSectionRef.current?.parentElement,
          start: `top+=${index * window.innerHeight} top`,
          end: `top+=${(index + 1) * window.innerHeight} top`,
          scrub: false,
          onEnter: () => {
            // Update current contact method
            setCurrentContactMethod(index);

            // Content crossfade - Apple style
            contactCardsRef.current.forEach((content, i) => {
              if (content) {
                gsap.to(content, {
                  opacity: i === index ? 1 : 0,
                  x: i === index ? 0 : (i < index ? -50 : 50),
                  duration: 1.0,
                  ease: "power2.out"
                });
              }
            });
          },
          onEnterBack: () => {
            // Update current contact method
            setCurrentContactMethod(index);

            // Content crossfade - Apple style
            contactCardsRef.current.forEach((content, i) => {
              if (content) {
                gsap.to(content, {
                  opacity: i === index ? 1 : 0,
                  x: i === index ? 0 : (i < index ? -50 : 50),
                  duration: 1.0,
                  ease: "power2.out"
                });
              }
            });
          }
        });
      });

      // Son contact method için ekstra görünürlük süresi
      ScrollTrigger.create({
        trigger: formSectionRef.current?.parentElement,
        start: `top+=${(contactMethods.length - 1) * window.innerHeight} top`,
        end: `top+=${(contactMethods.length + 0.5) * window.innerHeight} top`,
        scrub: false,
        onEnter: () => {
          setCurrentContactMethod(contactMethods.length - 1);

          contactCardsRef.current.forEach((content, i) => {
            if (content) {
              gsap.to(content, {
                opacity: i === contactMethods.length - 1 ? 1 : 0,
                x: i === contactMethods.length - 1 ? 0 : (i < contactMethods.length - 1 ? -50 : 50),
                duration: 1.0,
                ease: "power2.out"
              });
            }
          });
        },
        onEnterBack: () => {
          setCurrentContactMethod(contactMethods.length - 1);

          contactCardsRef.current.forEach((content, i) => {
            if (content) {
              gsap.to(content, {
                opacity: i === contactMethods.length - 1 ? 1 : 0,
                x: i === contactMethods.length - 1 ? 0 : (i < contactMethods.length - 1 ? -50 : 50),
                duration: 1.0,
                ease: "power2.out"
              });
            }
          });
        }
      });

      // Apple-style zoom-out efekti için scroll trigger
      ScrollTrigger.create({
        trigger: formSectionRef.current?.parentElement,
        start: `top+=${(contactMethods.length + 0.5) * window.innerHeight} top`,
        end: `top+=${(contactMethods.length + 1.5) * window.innerHeight} top`,
        scrub: true,
        onUpdate: (self) => {
          if (formSectionRef.current) {
            const progress = self.progress;
            const scale = 1 - (progress * 0.3);
            const opacity = 1 - (progress * 0.8);
            const blur = progress * 20;

            gsap.set(formSectionRef.current, {
              scale: scale,
              opacity: opacity,
              filter: `blur(${blur}px)`,
              transformOrigin: "center center"
            });
          }
        },
        onEnterBack: () => {
          if (formSectionRef.current) {
            gsap.set(formSectionRef.current, {
              scale: 1,
              opacity: 1,
              filter: "blur(0px)"
            });
          }
        }
      });

      // 3️⃣ Apple "Reveal by Scroll" for form title
      const revealTextElement = document.querySelector('.apple-reveal-text');
      if (revealTextElement) {
        const words = revealTextElement.textContent?.split(' ') || [];
        revealTextElement.innerHTML = words
          .map(word => `<span class="word">${word}&nbsp;</span>`)
          .join('');

        const wordElements = revealTextElement.querySelectorAll('.word');

        gsap.fromTo(
          wordElements,
          { opacity: 0.1, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: 1,
            stagger: 0.15,
            scrollTrigger: {
              trigger: revealTextElement,
              start: "top 85%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );
      }

      // Form elements animation
      if (formRef.current) {
        gsap.from(formRef.current.children, {
          opacity: 0,
          y: 60,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      }

      // 4️⃣ Final CTA - parallax zoom-out
      gsap.fromTo(finalCtaRef.current,
        { scale: 1.05, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: finalCtaRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>İletişim | Hekimcan AKTAŞ</title>
        <meta name="description" content="Hekimcan AKTAŞ ile iletişime geçin. Proje teklifleri, iş birlikleri ve sorularınız için." />
      </Helmet>

      {/* 1️⃣ Apple Hero Section - Full Viewport, Motion Driven */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-white dark:bg-apple-gray-900 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100/80 dark:bg-apple-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-apple-gray-700/50 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-apple-gray-300" style={{ letterSpacing: '0.02em' }}>
              Yeni projeler için müsait
            </span>
          </div>

          <h1
            ref={titleRef}
            className="text-7xl md:text-8xl lg:text-9xl font-light text-gray-900 dark:text-white mb-8"
            style={{
              letterSpacing: '-0.03em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              fontWeight: 300
            }}
          >
            İletişim
          </h1>

          <p
            ref={subtitleRef}
            className="text-2xl md:text-3xl font-light text-gray-600 dark:text-apple-gray-400 max-w-4xl mx-auto leading-relaxed mb-12"
            style={{
              letterSpacing: '-0.02em',
              fontWeight: 300
            }}
          >
            Proje teklifleri, iş birlikleri ve sorularınız için benimle iletişime geçin
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              ref={(el) => (ctaRefs.current[0] = el)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: '#0071E3',
                fontWeight: 400
              }}
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>Mesaj Gönder</span>
              <Send size={20} />
            </button>

            <button
              ref={(el) => (ctaRefs.current[1] = el)}
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-300 dark:border-apple-gray-600 hover:border-gray-400 dark:hover:border-apple-gray-500 text-gray-700 dark:text-apple-gray-300 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105"
              style={{ fontWeight: 400 }}
              onClick={() => window.open('mailto:hekimcanaktas@gmail.com', '_blank')}
            >
              Email Gönder
            </button>
          </div>
        </div>
      </section>

      {/* 2️⃣ Apple-style Section Header - Sticky Container Dışında */}
      <div className="py-24 bg-white dark:bg-apple-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2
            className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 dark:text-white mb-6 tracking-tighter"
            style={{
              letterSpacing: '-0.03em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
            }}
          >
            İletişim Yolları
          </h2>
          <p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto font-light"
          >
            Size en uygun yöntemi seçin ve hemen başlayalım
          </p>
        </div>
      </div>

      <section
        className="relative"
        style={{ height: `${(contactMethods.length + 1.5) * 100}vh` }}
      >
        {/* Apple-style Sticky Container - Sadece İletişim İçeriği */}
        <div
          ref={formSectionRef}
          className="sticky top-0 h-screen bg-white dark:bg-apple-gray-900 overflow-hidden"
        >

          {/* Apple-style Step Indicator - Sağ Taraf */}
          <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
            <div className="flex flex-col gap-6">
              {contactMethods.map((_, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => {
                      // İletişim yöntemleri section'ının başlangıç pozisyonunu bul
                      const contactSection = formSectionRef.current?.parentElement;
                      if (contactSection) {
                        const sectionTop = contactSection.offsetTop;
                        const targetScroll = sectionTop + (index * window.innerHeight);
                        window.scrollTo({
                          top: targetScroll,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`w-4 h-4 rounded-full transition-all duration-500 ${index === currentContactMethod
                      ? 'bg-blue-600 scale-125 shadow-lg shadow-blue-600/50'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                  />
                  {/* Step Line */}
                  {index < contactMethods.length - 1 && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
                  )}
                  {/* Step Number */}
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    0{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Apple-style Main Content Area - Sabit */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[60vh]">

                {/* Sol Taraf - Apple Typography */}
                <div className="relative min-h-[600px] flex flex-col justify-center">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      ref={(el) => (contactCardsRef.current[index] = el)}
                      className="absolute inset-0 flex flex-col justify-center space-y-12 transition-all duration-1000 ease-out"
                      style={{
                        opacity: index === 0 ? 1 : 0,
                        transform: index === 0 ? 'translateX(0)' : 'translateX(50px)',
                        zIndex: index === 0 ? 10 : 1
                      }}
                    >
                      {/* Apple-style Contact Number */}
                      <div className="relative">
                        <div className="text-[200px] md:text-[250px] lg:text-[300px] font-extralight text-gray-50 dark:text-gray-900 leading-none select-none absolute -top-20 -left-8 z-0">
                          0{index + 1}
                        </div>
                        <div className="relative z-10">
                          <div className="text-sm font-medium text-blue-600 uppercase tracking-[0.2em] mb-4">
                            İletişim {String(index + 1).padStart(2, '0')}
                          </div>
                        </div>
                      </div>

                      {/* Apple-style Contact Title */}
                      <div className="space-y-6">
                        <h3
                          className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 dark:text-white leading-[0.9] tracking-tight"
                          style={{
                            fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
                            letterSpacing: '-0.02em',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
                          }}
                        >
                          {method.title}
                        </h3>

                        {/* Apple-style Subtitle/Category */}
                        <div className="text-2xl md:text-3xl text-blue-600 font-light tracking-wide">
                          {method.value}
                        </div>
                      </div>

                      {/* Apple-style Description */}
                      <div className="space-y-6 max-w-2xl">
                        <p
                          className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-light leading-relaxed"
                          style={{
                            lineHeight: '1.4',
                            letterSpacing: '0.01em'
                          }}
                        >
                          {method.description}
                        </p>
                      </div>

                      {/* Apple-style Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-8">
                        <button
                          onClick={() => {
                            if (method.action.startsWith('mailto:') || method.action.startsWith('tel:')) {
                              window.open(method.action, '_blank');
                            }
                          }}
                          className="group inline-flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl font-medium text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                          style={{ backgroundColor: '#0071E3' }}
                        >
                          <span>İletişime Geç</span>
                          <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sağ Taraf - Apple-style Contact Visual */}
                <div className="relative min-h-[600px] flex items-center justify-center">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ opacity: index === 0 ? 1 : 0 }}
                    >
                      <div className="relative w-full max-w-lg">
                        {/* Apple-style Ambient Glow */}
                        <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/8 via-purple-600/8 to-blue-600/8 rounded-[2rem] blur-3xl opacity-80"></div>

                        {/* Apple-style Device Frame */}
                        <div className="relative">
                          {/* Main Icon Container */}
                          <div className="relative overflow-hidden rounded-[1.5rem] shadow-2xl bg-white dark:bg-gray-800 border border-gray-200/20 dark:border-gray-700/20 p-16">

                            {/* Contact Icon */}
                            <div className="relative flex items-center justify-center">
                              <div className="p-12 bg-blue-100 rounded-full">
                                <method.icon size={120} className="text-blue-600" />
                              </div>

                              {/* Apple-style Reflection */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10 rounded-full"></div>
                            </div>
                          </div>

                          {/* Apple-style Floating Elements */}
                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600/10 rounded-full blur-xl animate-pulse"></div>
                          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-600/10 rounded-full blur-xl"></div>
                        </div>

                        {/* Apple-style Quick Actions */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
                          <button
                            onClick={() => {
                              if (method.action.startsWith('mailto:') || method.action.startsWith('tel:')) {
                                window.open(method.action, '_blank');
                              }
                            }}
                            className="group p-4 bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl backdrop-blur-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                            aria-label={method.title}
                          >
                            <method.icon size={24} className="group-hover:scale-110 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Apple-style Bottom Navigation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white rounded-full font-medium shadow-lg hover:shadow-xl backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
            >
              <span>Mesaj Gönder</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 3️⃣ Apple Stepper Form Section */}
      <section className="py-40 bg-white dark:bg-apple-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-32">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-6">
              Mesaj Gönder
            </div>
            <h2
              className="apple-reveal-text text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 dark:text-white mb-8 max-w-4xl mx-auto"
              style={{
                letterSpacing: '-0.03em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                fontWeight: 300
              }}
            >
              Fikirlerinizi paylaşın. Birlikte harika projeler yapalım.
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Stepper */}
            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />

            <form
              id="contact-form"
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-12"
            >
              {/* Step Content Container - Sabit yükseklik ve overflow kontrolü */}
              <div className="relative min-h-[500px] overflow-hidden">

                {/* Step 0: İletişim Bilgileri */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${currentStep === 0
                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                    : currentStep > 0
                      ? 'opacity-0 -translate-x-full pointer-events-none'
                      : 'opacity-0 translate-x-full pointer-events-none'
                    }`}
                >
                  <div className="space-y-12">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-4">İletişim Bilgileriniz</h3>
                      <p className="text-lg text-gray-600 dark:text-apple-gray-400">Size nasıl ulaşabiliriz?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-3">
                        <label
                          htmlFor="name"
                          className="block text-lg font-light text-gray-900 dark:text-white"
                          style={{
                            fontWeight: 300,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
                          }}
                        >
                          Ad Soyad *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-0 py-6 border-0 border-b-2 border-gray-200 dark:border-apple-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent text-xl text-gray-900 dark:text-white transition-all duration-500"
                          style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                            fontSize: '20px',
                            fontWeight: 300
                          }}
                          placeholder="Adınızı yazın"
                        />
                      </div>

                      <div className="space-y-3">
                        <label
                          htmlFor="email"
                          className="block text-lg font-light text-gray-900 dark:text-white"
                          style={{
                            fontWeight: 300,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
                          }}
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-0 py-6 border-0 border-b-2 border-gray-200 dark:border-apple-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent text-xl text-gray-900 dark:text-white transition-all duration-500"
                          style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                            fontSize: '20px',
                            fontWeight: 300
                          }}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 1: Proje Detayları */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${currentStep === 1
                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                    : currentStep > 1
                      ? 'opacity-0 -translate-x-full pointer-events-none'
                      : 'opacity-0 translate-x-full pointer-events-none'
                    }`}
                >
                  <div className="space-y-12">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-4">Proje Detayları</h3>
                      <p className="text-lg text-gray-600 dark:text-apple-gray-400">Projeniz hakkında bize bilgi verin</p>
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="subject"
                        className="block text-lg font-light text-gray-900 dark:text-white"
                        style={{
                          fontWeight: 300,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
                        }}
                      >
                        Proje Konusu *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-0 py-6 border-0 border-b-2 border-gray-200 dark:border-apple-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent text-xl text-gray-900 dark:text-white transition-all duration-500"
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                          fontSize: '20px',
                          fontWeight: 300
                        }}
                        placeholder="Web sitesi, mobil uygulama, e-ticaret..."
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Mesaj */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${currentStep === 2
                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                    : currentStep > 2
                      ? 'opacity-0 -translate-x-full pointer-events-none'
                      : 'opacity-0 translate-x-full pointer-events-none'
                    }`}
                >
                  <div className="space-y-12">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-4">Mesajınız</h3>
                      <p className="text-lg text-gray-600 dark:text-apple-gray-400">Projeniz hakkında detayları paylaşın</p>
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="message"
                        className="block text-lg font-light text-gray-900 dark:text-white"
                        style={{
                          fontWeight: 300,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
                        }}
                      >
                        Detaylı Mesaj *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={8}
                        className="w-full px-0 py-6 border-0 border-b-2 border-gray-200 dark:border-apple-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-transparent text-xl text-gray-900 dark:text-white transition-all duration-500 resize-none"
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                          fontSize: '20px',
                          fontWeight: 300
                        }}
                        placeholder="Projenizin hedefleri, beklentileriniz, bütçe aralığı ve zaman çizelgesi hakkında bilgi verin..."
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Gönder */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${currentStep === 3
                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                    : 'opacity-0 translate-x-full pointer-events-none'
                    }`}
                >
                  <div className="space-y-12">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-4">Özet ve Gönder</h3>
                      <p className="text-lg text-gray-600 dark:text-apple-gray-400">Bilgilerinizi kontrol edin ve mesajınızı gönderin</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-apple-gray-800 rounded-2xl p-8 space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">İletişim Bilgileri</h4>
                        <p className="text-gray-600 dark:text-apple-gray-300">{formData.name} - {formData.email}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Proje Konusu</h4>
                        <p className="text-gray-600 dark:text-apple-gray-300">{formData.subject}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Mesaj</h4>
                        <p className="text-gray-600 dark:text-apple-gray-300">{formData.message}</p>
                      </div>
                    </div>

                    <div className="text-center pt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-4 px-16 py-6 bg-blue-600 text-white rounded-full font-light text-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: '#0071E3',
                          fontWeight: 300,
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Gönderiliyor...</span>
                          </>
                        ) : (
                          <>
                            <span>Mesajı Gönder</span>
                            <Send size={24} />
                          </>
                        )}
                      </button>

                      {submitStatus === 'success' && (
                        <p className="mt-8 text-green-600 font-light text-lg">Mesajınız başarıyla gönderildi!</p>
                      )}
                      {submitStatus === 'error' && (
                        <p className="mt-8 text-red-600 font-light text-lg">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-12">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-apple-gray-600 text-gray-700 dark:text-apple-gray-300 rounded-full font-medium transition-all duration-300 hover:border-gray-400 dark:hover:border-apple-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                  <span>Önceki</span>
                </button>

                {currentStep < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium transition-all duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#0071E3' }}
                  >
                    <span>Sonraki</span>
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 4️⃣ Apple Final CTA Section */}
      <section className="py-24 bg-gray-50 dark:bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div ref={finalCtaRef} className="space-y-8">
            <h2
              className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white"
              style={{
                letterSpacing: '-0.03em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                fontWeight: 300
              }}
            >
              Birlikte Çalışalım
            </h2>

            <p
              className="text-xl md:text-2xl font-light text-gray-600 dark:text-apple-gray-400"
              style={{
                letterSpacing: '-0.02em',
                fontWeight: 300
              }}
            >
              Fikirlerinizi gerçeğe dönüştürelim
            </p>

            <button
              className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-medium text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: '#0071E3',
                fontWeight: 400
              }}
              onClick={() => window.open('mailto:hekimcanaktas@gmail.com', '_blank')}
            >
              <span>Hemen İletişime Geç</span>
              <ArrowRight size={22} />
            </button>

            <p className="text-sm text-gray-500 dark:text-apple-gray-400 mt-4" style={{ fontWeight: 300 }}>
              24 saat içinde geri dönüş yapıyorum
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
