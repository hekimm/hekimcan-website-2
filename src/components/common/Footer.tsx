import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Lock, ArrowUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FooterSettings {
  id: number;
  about_text: string;
  navigation_links: Array<{ label: string; url: string; }>;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  copyright_text: string;
  cta_text?: string;
  contact_address: string;
  contact_email: string;
  contact_phone: string;
}

const Footer = () => {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Apple-style GSAP refs
  const footerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const backToTopRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('footer_settings')
          .select('*')
          .limit(1)
          .single();

        if (error) throw error;
        setSettings(data);
      } catch (error) {
        console.error('Footer ayarları yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Apple-style GSAP animations
  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {

        // Apple-style staggered footer sections
        gsap.fromTo([brandRef.current, navRef.current, contactRef.current],
          {
            y: 80,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Apple-style bottom section animation
        gsap.fromTo(bottomRef.current,
          {
            y: 50,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.5,
            scrollTrigger: {
              trigger: bottomRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Apple-style back to top button
        gsap.fromTo(backToTopRef.current,
          {
            scale: 0,
            rotation: -180,
            opacity: 0
          },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: 0.8,
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

      }, footerRef);

      return () => ctx.revert();
    }
  }, [loading]);

  // Apple-style smooth scroll to top
  const scrollToTop = () => {
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 1.2,
      ease: "power3.inOut"
    });
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-apple-gray-50 dark:bg-black border-t border-apple-gray-200/30 dark:border-apple-gray-800/30 overflow-hidden"
    >
      {/* Apple-style Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-apple-blue/2 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-apple-purple/2 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-apple-blue/1 via-transparent to-apple-purple/1 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Apple-style Brand Section */}
          <div ref={brandRef}>
            <Link
              to="/"
              className="text-3xl font-light text-apple-gray-900 dark:text-white tracking-tight font-system hover:text-apple-blue transition-colors duration-300"
            >
              Hekimcan AKTAŞ
            </Link>
            <p className="mt-6 text-lg text-apple-gray-600 dark:text-apple-gray-400 leading-relaxed font-light">
              {loading ? (
                <div className="h-5 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-xl w-3/4 animate-pulse" />
              ) : (
                settings?.about_text || 'Modern web teknolojileri ile yenilikçi çözümler geliştiren yazılım geliştirici.'
              )}
            </p>

            {/* Apple-style Social Links */}
            <div className="flex mt-8 space-x-4">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-2xl animate-pulse" />
                ))
              ) : (
                <>
                  {settings?.social_links.github && (
                    <a
                      href={settings.social_links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Github"
                      className="group p-3 rounded-2xl bg-white/60 dark:bg-apple-gray-800/60 backdrop-blur-xl border border-apple-gray-200/50 dark:border-apple-gray-700/50 text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue hover:bg-white/80 dark:hover:bg-apple-gray-800/80 transition-all duration-300 transform hover:scale-110 active:scale-95"
                      onMouseEnter={(e) => {
                        gsap.to(e.currentTarget, { y: -4, duration: 0.3, ease: "power2.out" });
                      }}
                      onMouseLeave={(e) => {
                        gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: "power2.out" });
                      }}
                    >
                      <Github size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                    </a>
                  )}
                  {settings?.social_links.linkedin && (
                    <a
                      href={settings.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="group p-3 rounded-2xl bg-white/60 dark:bg-apple-gray-800/60 backdrop-blur-xl border border-apple-gray-200/50 dark:border-apple-gray-700/50 text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue hover:bg-white/80 dark:hover:bg-apple-gray-800/80 transition-all duration-300 transform hover:scale-110 active:scale-95"
                      onMouseEnter={(e) => {
                        gsap.to(e.currentTarget, { y: -4, duration: 0.3, ease: "power2.out" });
                      }}
                      onMouseLeave={(e) => {
                        gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: "power2.out" });
                      }}
                    >
                      <Linkedin size={20} className="group-hover:scale-110 transition-transform duration-300" />
                    </a>
                  )}
                  {settings?.social_links.twitter && (
                    <a
                      href={settings.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="group p-3 rounded-2xl bg-white/60 dark:bg-apple-gray-800/60 backdrop-blur-xl border border-apple-gray-200/50 dark:border-apple-gray-700/50 text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue hover:bg-white/80 dark:hover:bg-apple-gray-800/80 transition-all duration-300 transform hover:scale-110 active:scale-95"
                      onMouseEnter={(e) => {
                        gsap.to(e.currentTarget, { y: -4, duration: 0.3, ease: "power2.out" });
                      }}
                      onMouseLeave={(e) => {
                        gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: "power2.out" });
                      }}
                    >
                      <Twitter size={20} className="group-hover:-rotate-12 transition-transform duration-300" />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Apple-style Navigation Links */}
          <div ref={navRef}>
            <h3 className="text-2xl font-light mb-8 text-apple-gray-900 dark:text-white tracking-tight font-system">
              Sayfalar
            </h3>
            <nav className="flex flex-col space-y-4">
              {[
                { to: '/', label: 'Ana Sayfa' },
                { to: '/hakkimda', label: 'Hakkımda' },
                { to: '/projeler', label: 'Projeler' },
                { to: '/egitim', label: 'Eğitim' },
                { to: '/iletisim', label: 'İletişim' },
              ].map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group text-lg text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue transition-all duration-300 font-light"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, { x: 8, duration: 0.3, ease: "power2.out" });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { x: 0, duration: 0.3, ease: "power2.out" });
                  }}
                >
                  <span className="group-hover:tracking-wide transition-all duration-300">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Apple-style Contact Info */}
          <div ref={contactRef}>
            <h3 className="text-2xl font-light mb-8 text-apple-gray-900 dark:text-white tracking-tight font-system">
              İletişim
            </h3>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-5 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-xl w-3/4 animate-pulse" />
                ))}
              </div>
            ) : (
              <address className="not-italic text-apple-gray-600 dark:text-apple-gray-400 space-y-4 font-light">
                {settings?.contact_address && (
                  <p className="text-lg leading-relaxed">{settings.contact_address}</p>
                )}
                {settings?.contact_email && (
                  <p>
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="text-lg hover:text-apple-blue transition-colors duration-300 hover:tracking-wide"
                    >
                      {settings.contact_email}
                    </a>
                  </p>
                )}
                {settings?.contact_phone && (
                  <p>
                    <a
                      href={`tel:${settings.contact_phone.replace(/\s/g, '')}`}
                      className="text-lg hover:text-apple-blue transition-colors duration-300 hover:tracking-wide"
                    >
                      {settings.contact_phone}
                    </a>
                  </p>
                )}
              </address>
            )}
          </div>
        </div>

        {/* Apple-style Bottom Section */}
        <div
          ref={bottomRef}
          className="border-t border-apple-gray-200/30 dark:border-apple-gray-800/30 pt-12 flex flex-col sm:flex-row justify-between items-center gap-6"
        >
          <p className="text-apple-gray-600 dark:text-apple-gray-400 text-base font-light">
            {loading ? (
              <div className="h-5 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-xl w-64 animate-pulse" />
            ) : (
              settings?.copyright_text || '© 2024 Hekimcan AKTAŞ. Tüm hakları saklıdır.'
            )}
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/admin/giris"
              className="group flex items-center gap-3 text-apple-gray-500 hover:text-apple-blue dark:text-apple-gray-400 dark:hover:text-apple-blue transition-all duration-300 text-base font-light"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget.querySelector('.lock-icon'), { rotation: 15, duration: 0.3 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget.querySelector('.lock-icon'), { rotation: 0, duration: 0.3 });
              }}
            >
              <Lock size={18} className="lock-icon transition-transform duration-300" />
              <span className="group-hover:tracking-wide transition-all duration-300">Admin Girişi</span>
            </Link>

            {/* Apple-style Back to Top Button */}
            <button
              ref={backToTopRef}
              onClick={scrollToTop}
              className="group p-3 rounded-2xl bg-white/60 dark:bg-apple-gray-800/60 backdrop-blur-xl border border-apple-gray-200/50 dark:border-apple-gray-700/50 text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-blue hover:bg-white/80 dark:hover:bg-apple-gray-800/80 transition-all duration-300 transform hover:scale-110 active:scale-95"
              aria-label="Başa Dön"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { y: -4, duration: 0.3, ease: "power2.out" });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: "power2.out" });
              }}
            >
              <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
