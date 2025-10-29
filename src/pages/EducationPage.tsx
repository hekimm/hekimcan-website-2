import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowRight, Users, Code, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Egitim = Database['public']['Tables']['egitim']['Row'];

const EducationPage = () => {
  const [educations, setEducations] = useState<Egitim[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  // GSAP refs - Apple'ın tam spesifikasyonları
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Sticky Stepper refs
  const stepperSectionRef = useRef<HTMLElement>(null);
  const stepperContainerRef = useRef<HTMLDivElement>(null);
  const stepperContentRefs = useRef<(HTMLDivElement | null)[]>([]);



  // Why section refs
  const whySectionRef = useRef<HTMLDivElement>(null);
  const whyCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Final CTA refs
  const finalCtaRef = useRef<HTMLDivElement>(null);

  // Apple'ın eğitim yolculuğu adımları - "My Education Journey"
  const educationSteps = [
    {
      id: 1,
      title: "Lise Eğitimi",
      description: "Övgü Terzibşıoğlu Anadolu Lisesi'nde matematik ve fen bilimleri alanında güçlü bir temel oluşturdum. Bu dönemde akademik başarılarımla öne çıktım ve programlama dünyasına ilk adımımı attım.",
      bgColorLight: "#f5f5f7",
      bgColorDark: "#1d1d1f",
      textColorLight: "#1d1d1f",
      textColorDark: "#f5f5f7"
    },
    {
      id: 2,
      title: "Yazılım Mühendisliği",
      description: "Manisa Celal Bayar Üniversitesi'nde Yazılım Mühendisliği alanında lisans eğitimime devam ediyorum. Modern yazılım geliştirme teknolojileri, veri yapıları, algoritmalar ve yazılım mimarisi konularında kapsamlı eğitim alıyorum.",
      bgColorLight: "#0071e3",
      bgColorDark: "#0a84ff",
      textColorLight: "#ffffff",
      textColorDark: "#ffffff"
    }
  ];





  // Apple'ın "Education Values" kartları
  const educationValues = [
    {
      icon: Users,
      title: "Kaliteli Eğitim",
      description: "Türkiye'nin önde gelen eğitim kurumlarından aldığım nitelikli eğitim"
    },
    {
      icon: Code,
      title: "Pratik Odaklı",
      description: "Teorik bilgiyi pratiğe döken projeler ve uygulamalı çalışmalar"
    },
    {
      icon: Award,
      title: "Sürekli Gelişim",
      description: "Teknolojinin gelişimine ayak uyduran sürekli öğrenme yaklaşımı"
    }
  ];

  // Varsayılan eğitim verileri
  const defaultEducations: Egitim[] = [
    {
      id: 1,
      kurum_adi: "Övgü Terzibşıoğlu Anadolu Lisesi",
      bolum: "Fen Bilimleri",
      derece: "Lise",
      baslangic_tarihi: "2017",
      bitis_tarihi: "2021",
      aciklama: "Matematik ve fen bilimleri alanında güçlü bir temel oluşturdum. Bu dönemde akademik başarılarımla öne çıktım ve programlama dünyasına ilk adımımı attım.",
      not_ortalamasi: null,
      sehir: "İzmir",
      ulke: "Türkiye",
      aktif: true,
      sira_no: 1,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      kurum_adi: "Manisa Celal Bayar Üniversitesi",
      bolum: "Yazılım Mühendisliği",
      derece: "Lisans",
      baslangic_tarihi: "Eylül 2021",
      bitis_tarihi: null,
      aciklama: "Yazılım Mühendisliği alanında lisans eğitimime devam ediyorum. Modern yazılım geliştirme teknolojileri, veri yapıları, algoritmalar ve yazılım mimarisi konularında kapsamlı eğitim alıyorum.",
      not_ortalamasi: null,
      sehir: "Manisa",
      ulke: "Türkiye",
      aktif: true,
      sira_no: 2,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  ];

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const { data, error } = await supabase
          .from('egitim')
          .select('*')
          .eq('aktif', true)
          .order('sira_no', { ascending: true });

        if (error) {
          // Eğer tablo yoksa veya hata varsa varsayılan verileri kullan
          console.log('Supabase\'den veri çekilemedi, varsayılan veriler kullanılıyor:', error.message);
          setEducations(defaultEducations);
        } else {
          // Eğer veri varsa onu kullan, yoksa varsayılan verileri kullan
          setEducations(data && data.length > 0 ? data : defaultEducations);
        }
      } catch (error) {
        console.error('Eğitim verileri çekilemedi, varsayılan veriler kullanılıyor:', error);
        setEducations(defaultEducations);
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();
  }, []);

  // Apple'ın tam GSAP animasyon sistemi
  useEffect(() => {
    if (!loading) {
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

        // 2️⃣ Sticky Stepper - Apple'ın "Education Journey" klonu
        if (stepperSectionRef.current) {
          ScrollTrigger.create({
            trigger: stepperSectionRef.current,
            start: "top top",
            end: "+=50vh",
            pin: stepperContainerRef.current,
            scrub: false,
            onUpdate: (self) => {
              const progress = self.progress;
              const stepIndex = Math.floor(progress * educationSteps.length);
              const clampedIndex = Math.min(stepIndex, educationSteps.length - 1);

              if (clampedIndex !== currentStep) {
                setCurrentStep(clampedIndex);

                // Background color transition - Apple'ın signature renkleri
                const step = educationSteps[clampedIndex];
                const isDark = document.documentElement.classList.contains('dark');
                gsap.to(stepperSectionRef.current, {
                  backgroundColor: isDark ? step.bgColorDark : step.bgColorLight,
                  duration: 1.2,
                  ease: "power2.out"
                });

                // Content crossfade
                stepperContentRefs.current.forEach((content, i) => {
                  if (content) {
                    gsap.to(content, {
                      opacity: i === clampedIndex ? 1 : 0,
                      scale: i === clampedIndex ? 1 : 1.05,
                      duration: 0.8,
                      ease: "power2.out"
                    });
                  }
                });
              }
            }
          });
        }





        // 3️⃣ Why section - stagger animation
        gsap.from(whyCardRefs.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: whySectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });

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
    }
  }, [loading, educationSteps.length, currentStep]);

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
      <Helmet>
        <title>Eğitim | Hekimcan AKTAŞ</title>
        <meta name="description" content="Code. Create. Learn. - Hekimcan AKTAŞ'ın eğitim yolculuğu ve sürekli öğrenme deneyimi" />
      </Helmet>

      {/* 1️⃣ Apple Hero Section - Full Viewport, Motion Driven */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300" style={{ letterSpacing: '0.02em' }}>
              Sürekli Öğrenmeye Devam Ediyorum
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
            Eğitim Yolculuğum
          </h1>

          <p
            ref={subtitleRef}
            className="text-2xl md:text-3xl font-light text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12"
            style={{
              letterSpacing: '-0.02em',
              fontWeight: 300
            }}
          >
            Akademik geçmişim ve sürekli öğrenme deneyimim
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              ref={(el) => (ctaRefs.current[0] = el)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: '#0071E3',
                fontWeight: 400
              }}
            >
              <span>Eğitim Geçmişi</span>
              <ArrowRight size={20} />
            </button>

            <button
              ref={(el) => (ctaRefs.current[1] = el)}
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105"
              style={{ fontWeight: 400 }}
            >
              Sertifikalarım
            </button>
          </div>
        </div>
      </section>

      {/* 2️⃣ Apple Sticky Stepper - "My Education Journey" */}
      <section
        ref={stepperSectionRef}
        className="relative transition-colors duration-1200 ease-out bg-[#f5f5f7] dark:bg-[#1d1d1f]"
        style={{ height: '150vh' }}
      >
        <div
          ref={stepperContainerRef}
          className="sticky top-0 h-screen overflow-hidden flex items-center"
        >
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Sol Taraf - Sticky Content */}
              <div className="space-y-8">
                <div className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                  Eğitim Yolculuğum
                </div>

                <h2
                  className="text-6xl md:text-7xl font-light leading-tight text-gray-900 dark:text-white"
                  style={{
                    letterSpacing: '-0.03em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                    fontWeight: 300
                  }}
                >
                  Akademik<br />Gelişim
                </h2>

                <p
                  className="text-xl md:text-2xl font-light leading-relaxed max-w-lg text-gray-600 dark:text-gray-400"
                  style={{
                    letterSpacing: '-0.02em',
                    fontWeight: 300
                  }}
                >
                  Her aşamada kazandığım bilgi ve deneyimler
                </p>
              </div>

              {/* Sağ Taraf - Değişen İçerik */}
              <div className="relative min-h-[600px] flex items-center">
                {educationSteps.map((step, index) => (
                  <div
                    key={step.id}
                    ref={(el) => (stepperContentRefs.current[index] = el)}
                    className="absolute inset-0 flex items-center opacity-0"
                    style={{ opacity: index === 0 ? 1 : 0 }}
                  >
                    <div className="space-y-8 w-full">
                      <div className="space-y-6">
                        <div
                          className="text-8xl md:text-9xl font-light text-gray-900 dark:text-white"
                          style={{
                            letterSpacing: '-0.05em',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                            fontWeight: 200
                          }}
                        >
                          {String(step.id).padStart(2, '0')}
                        </div>

                        <h3
                          className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 dark:text-white"
                          style={{
                            letterSpacing: '-0.02em'
                          }}
                        >
                          {step.title}
                        </h3>

                        <p
                          className="text-xl leading-relaxed max-w-md text-gray-600 dark:text-gray-400"
                          style={{
                            fontWeight: 300
                          }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Progress Indicator */}
          <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
            <div className="flex flex-col gap-4">
              {educationSteps.map((_, index) => (
                <div key={index} className="relative">
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${currentStep === index
                      ? 'bg-blue-600 scale-125 shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    style={{ backgroundColor: currentStep === index ? '#0071E3' : undefined }}
                  />
                  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    0{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>







      {/* 4️⃣ Apple Final CTA Section */}
      <section className="py-24 bg-white dark:bg-black">
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
              Öğrenme Hiç Bitmez
            </h2>

            <p
              className="text-xl md:text-2xl font-light text-gray-600 dark:text-gray-400"
              style={{
                letterSpacing: '-0.02em',
                fontWeight: 300
              }}
            >
              Learning that inspires. Projects that matter.
            </p>

            <button
              className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-medium text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: '#0071E3',
                fontWeight: 400
              }}
            >
              <span>Projelerimi İncele</span>
              <ArrowRight size={22} />
            </button>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4" style={{ fontWeight: 300 }}>
              Her gün yeni şeyler öğrenmeye devam ediyorum
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default EducationPage;
