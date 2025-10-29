import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

// GSAP plugin'ini kaydet
gsap.registerPlugin(ScrollTrigger);

type Profil = Database['public']['Tables']['profil']['Row'];

interface StorySection {
  id: number;
  title: string;
  content: string;
}

const AboutContent = () => {
  const [profileData, setProfileData] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLParagraphElement[]>([]);

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

  // Hakkımda içeriğini bölümlere ayır
  const createStorySections = (aboutText: string): StorySection[] => {
    if (!aboutText) {
      return [
        {
          id: 1,
          title: "Başlangıç",
          content: "Yazılım geliştirme alanında uzun yıllara dayanan deneyimim ile modern web teknolojilerini kullanarak kullanıcı dostu uygulamalar geliştiriyorum."
        },
        {
          id: 2,
          title: "Uzmanlık",
          content: "Front-end ve back-end teknolojilerinde uzmanlaşmış bir yazılım geliştirici olarak, yüksek performanslı ve ölçeklenebilir çözümler üretiyorum."
        },
        {
          id: 3,
          title: "Yaklaşım",
          content: "Ekip çalışmasına ve temiz kod prensibine büyük önem vererek, sürdürülebilir ve kaliteli yazılım projeleri hayata geçiriyorum."
        },
        {
          id: 4,
          title: "Vizyon",
          content: "Teknolojinin gücünü kullanarak, kullanıcı deneyimini ön planda tutan ve iş süreçlerini optimize eden çözümler geliştirmeye odaklanıyorum."
        }
      ];
    }

    const paragraphs = aboutText.split('\n').filter(p => p.trim() !== '');
    const sections: StorySection[] = [];

    paragraphs.forEach((paragraph, index) => {
      const titles = ["Başlangıç", "Yolculuk", "Deneyim", "Vizyon", "Gelecek", "Hedefler", "Misyon", "Değerler"];
      sections.push({
        id: index + 1,
        title: titles[index] || "Devam",
        content: paragraph.trim()
      });
    });

    return sections;
  };

  const storySections = createStorySections(profileData?.hakkimda || '');

  // Apple'ın Reveal by Scroll tekniği için metin split fonksiyonu
  const splitTextToWords = (text: string, element: HTMLElement) => {
    const words = text.split(' ');
    element.innerHTML = words
      .map(word => `<span class="word" style="display: inline-block; opacity: 0.12; transform: translateY(30px); filter: blur(1px);">${word}&nbsp;</span>`)
      .join('');
  };

  useEffect(() => {
    if (loading || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Sticky image animation
      if (imageRef.current) {
        gsap.set(imageRef.current, { scale: 0.9, opacity: 0.8 });

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            if (imageRef.current) {
              gsap.to(imageRef.current, {
                scale: 0.9 + (progress * 0.1),
                opacity: 0.8 + (progress * 0.2),
                duration: 0.3
              });
            }
          }
        });
      }

      // Progress bar animation
      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleY: 0 });

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              gsap.to(progressRef.current, {
                scaleY: self.progress,
                duration: 0.1
              });
            }
          }
        });
      }

      // Apple'ın Reveal by Scroll animasyonu
      textRefs.current.forEach((textElement, index) => {
        if (!textElement) return;

        const originalText = storySections[index]?.content || '';
        if (originalText) {
          // Metni kelimelere böl
          splitTextToWords(originalText, textElement);

          // Apple'ın signature word reveal animasyonu
          const words = textElement.querySelectorAll('.word');

          gsap.fromTo(
            words,
            {
              opacity: 0.12,
              y: 30,
              filter: 'blur(1px)'
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              ease: "cubic-bezier(0.22, 1, 0.36, 1)", // Apple'ın signature easing
              duration: 1.2,
              stagger: 0.15, // Her kelime 0.15s gecikmeyle
              scrollTrigger: {
                trigger: textElement,
                start: "top 85%",
                end: "bottom 60%",
                scrub: true, // Scroll ile senkron
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });

      // Section tracking
      sectionsRef.current.forEach((section, index) => {
        if (!section) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top center+=100",
          end: "bottom center-=100",
          onEnter: () => setActiveSection(index),
          onEnterBack: () => setActiveSection(index),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading, storySections.length]);

  if (loading) {
    return (
      <section className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-pulse space-y-8 max-w-4xl mx-auto px-6">
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl w-3/4 mx-auto" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/2 mx-auto" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
            <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-3xl" />
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="bg-white dark:bg-black">
      {/* Header */}
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-gray-900 dark:text-white mb-8">
            Hikayem
          </h2>
          <p className="text-2xl md:text-3xl font-light text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Teknoloji tutkusu ile başlayan yolculuk
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Sticky Image - Sol taraf */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="relative aspect-[4/5] max-w-md mx-auto">
                  {/* Progress Bar */}
                  <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      ref={progressRef}
                      className="w-full bg-blue-600 origin-top rounded-full"
                      style={{ transformOrigin: 'top' }}
                    />
                  </div>

                  {/* Image Container */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-2xl">
                    {profileData?.resim_url ? (
                      <img
                        ref={imageRef}
                        src={profileData.resim_url}
                        alt={profileData.isim}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <div className="text-6xl font-semibold text-gray-400 dark:text-gray-600">
                          {profileData?.isim?.split(' ').map(n => n[0]).join('') || 'HA'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step Indicators */}
                  <div className="absolute -right-12 top-1/2 -translate-y-1/2 space-y-8">
                    {storySections.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === index
                          ? 'bg-blue-600 scale-125 shadow-lg'
                          : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections - Sağ taraf */}
            <div className="lg:col-span-7 space-y-32 pb-16">
              {storySections.map((section, index) => (
                <div
                  key={section.id}
                  ref={(el) => {
                    if (el) sectionsRef.current[index] = el;
                  }}
                  className="min-h-screen flex flex-col justify-center"
                >
                  <div className="space-y-8">
                    {/* Section Number */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg">
                        {section.id}
                      </div>
                      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                    </div>

                    {/* Section Title */}
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {section.title}
                    </h3>

                    {/* Section Content - Apple Reveal by Scroll */}
                    <p
                      ref={(el) => {
                        if (el) textRefs.current[index] = el;
                      }}
                      className="apple-reveal-text text-xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-300 font-light max-w-2xl"
                      style={{
                        fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                        lineHeight: '1.4',
                        fontWeight: '300',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
