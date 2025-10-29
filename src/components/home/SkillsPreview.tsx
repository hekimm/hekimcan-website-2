import { useState, useEffect, useRef } from 'react';
import { Database } from '../../lib/database.types';
import { supabase } from '../../lib/supabase';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Skill = Database['public']['Tables']['yetenekler']['Row'];

const SkillsPreview = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Apple-style GSAP refs
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const skillsGridRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('yetenekler')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(8);

        if (error) throw error;
        setSkills(data || []);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Apple-style GSAP animations
  useEffect(() => {
    if (!loading && skills.length > 0) {
      const ctx = gsap.context(() => {

        // Apple-style title animation - Elegant fade up
        gsap.fromTo(titleRef.current,
          {
            y: 80,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Apple-style subtitle animation
        gsap.fromTo(subtitleRef.current,
          {
            y: 60,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Apple-style staggered skills animation
        gsap.fromTo(skillRefs.current,
          {
            y: 100,
            opacity: 0,
            scale: 0.8,
            rotationX: 45
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: {
              amount: 0.6,
              from: "start"
            },
            scrollTrigger: {
              trigger: skillsGridRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Apple-style CTA animation
        gsap.fromTo(ctaRef.current,
          {
            y: 50,
            opacity: 0,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

      }, sectionRef);

      return () => ctx.revert();
    }
  }, [loading, skills]);

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-apple-gray-50 dark:bg-black relative overflow-hidden"
    >
      {/* Apple-style Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-apple-blue/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-apple-purple/3 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-apple-blue/2 via-transparent to-apple-purple/2 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Apple-style Section Header */}
        <div className="text-center mb-20">
          <h2
            ref={titleRef}
            className="text-6xl md:text-7xl lg:text-8xl font-light text-apple-gray-900 dark:text-white mb-8 tracking-tighter font-system"
            style={{ letterSpacing: '-0.03em' }}
          >
            Teknik Yetenekler
          </h2>
          <p
            ref={subtitleRef}
            className="text-2xl md:text-3xl text-apple-gray-600 dark:text-apple-gray-400 max-w-4xl mx-auto font-light leading-relaxed"
            style={{ lineHeight: '1.4' }}
          >
            Modern web teknolojileri ve yazılım geliştirme araçlarında uzmanlaştığım alanlar
          </p>
        </div>

        {loading ? (
          /* Apple-style Loading State */
          <div
            ref={skillsGridRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/60 dark:bg-apple-gray-800/60 backdrop-blur-xl rounded-3xl p-8 text-center border border-apple-gray-200/30 dark:border-apple-gray-700/30">
                  <div className="w-20 h-20 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-2xl mx-auto mb-6"></div>
                  <div className="h-6 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-xl w-3/4 mx-auto mb-3"></div>
                  <div className="h-4 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-lg w-1/2 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Apple-style Skills Grid */}
            <div
              ref={skillsGridRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            >
              {skills.map((skill, index) => (
                <div
                  key={skill.id}
                  ref={(el) => (skillRefs.current[index] = el)}
                  className="group cursor-pointer"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      y: -12,
                      scale: 1.05,
                      duration: 0.4,
                      ease: "power2.out"
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      y: 0,
                      scale: 1,
                      duration: 0.4,
                      ease: "power2.out"
                    });
                  }}
                >
                  {/* Apple-style Glass Card */}
                  <div className="relative bg-white/80 dark:bg-apple-gray-800/80 backdrop-blur-xl rounded-3xl p-8 text-center border border-apple-gray-200/50 dark:border-apple-gray-700/50 shadow-apple hover:shadow-apple-lg transition-all duration-500 overflow-hidden">

                    {/* Apple-style Ambient Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-apple-blue/5 via-apple-purple/5 to-apple-blue/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Icon Container */}
                    <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl bg-apple-gray-100/80 dark:bg-apple-gray-700/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm">
                      <img
                        src={skill.ikon_url}
                        alt={skill.isim}
                        className="w-12 h-12 object-contain filter group-hover:brightness-110 transition-all duration-300"
                      />
                    </div>

                    {/* Apple-style Typography */}
                    <div className="relative z-10">
                      <h3 className="text-xl font-medium text-apple-gray-900 dark:text-white mb-2 tracking-tight font-system">
                        {skill.isim}
                      </h3>
                      <p className="text-base text-apple-blue font-medium tracking-wide">
                        {skill.kategori}
                      </p>
                    </div>

                    {/* Apple-style Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10 rounded-3xl pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Apple-style CTA */}
            <div
              ref={ctaRef}
              className="text-center"
            >
              <Link
                to="/hakkimda"
                className="group inline-flex items-center gap-4 px-12 py-6 bg-apple-blue text-white rounded-2xl font-medium text-2xl shadow-apple hover:shadow-apple-lg transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Tüm Yetenekleri Gör</span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SkillsPreview;
