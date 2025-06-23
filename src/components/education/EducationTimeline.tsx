import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, BookOpen, Star, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Education = Database['public']['Tables']['education']['Row'];

const EducationTimeline = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const { data, error } = await supabase
          .from('education')
          .select('*')
          .order('start_date', { ascending: false });

        if (error) throw error;
        setEducation(data || []);
      } catch (error) {
        console.error('Error fetching education:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden">
        {/* Premium Loading Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10" />
          
          {/* Animated loading orbs */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto space-y-16">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
              >
                {/* Premium Loading Circle */}
                <div className="flex-shrink-0 relative">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center relative overflow-hidden backdrop-blur-sm border border-white/20 shadow-xl"
                    animate={{
                      boxShadow: [
                        "0 10px 30px rgba(59, 130, 246, 0.2)",
                        "0 20px 40px rgba(139, 92, 246, 0.3)",
                        "0 10px 30px rgba(59, 130, 246, 0.2)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <GraduationCap className="w-10 h-10 text-blue-500 dark:text-blue-400 relative z-10" />
                  </motion.div>
                </div>

                {/* Premium Loading Content */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-3">
                    <motion.div
                      className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl relative overflow-hidden"
                      style={{ backgroundSize: "200% 100%" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                    <motion.div
                      className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl w-3/4 relative overflow-hidden"
                      style={{ backgroundSize: "200% 100%" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    className="h-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl relative overflow-hidden"
                    style={{ backgroundSize: "200% 100%" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Premium Multi-layer Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10" />

        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Mouse-following background elements */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/10 to-purple-200/10 blur-3xl"
          style={{
            left: mousePosition.x / 50,
            top: mousePosition.y / 50,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />

        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-purple-200/10 to-pink-200/10 blur-3xl"
          style={{
            right: mousePosition.x / 80,
            bottom: mousePosition.y / 80,
          }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Timeline Container */}
          <div className="relative">
            {/* Premium Animated Timeline Line */}
            <div className="absolute left-10 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full shadow-lg opacity-80" />
            
            {/* Floating particles along timeline */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-8 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-sm"
                style={{ top: `${10 + i * 12}%` }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.7, 0.3],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Education Items */}
            <div className="space-y-24">
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    className="relative flex items-start gap-8 group"
                    initial={{ opacity: 0, x: -100, y: 50 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      delay: index * 0.2, 
                      duration: 0.8, 
                      ease: [0.25, 0.46, 0.45, 0.94] 
                    }}
                  >
                    {/* Premium 3D Timeline Node */}
                    <motion.div
                      className="flex-shrink-0 relative z-20"
                      whileHover={{ 
                        scale: 1.15,
                        rotateY: 15,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <motion.div
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/50 dark:to-purple-900/50 shadow-2xl border border-white/50 dark:border-gray-700/50 flex items-center justify-center relative overflow-hidden backdrop-blur-xl"
                        whileHover={{
                          boxShadow: [
                            "0 20px 40px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)",
                            "0 25px 50px rgba(139, 92, 246, 0.4), 0 0 0 2px rgba(139, 92, 246, 0.3)",
                            "0 20px 40px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)",
                          ],
                          y: [-5, -8, -5],
                        }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                      >
                        {/* Rotating shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/40 to-transparent"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400 relative z-10" />

                        {/* Floating sparkles around node */}
                        <motion.div
                          className="absolute -top-3 -right-3 text-yellow-400"
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.3, 1],
                          }}
                          transition={{
                            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                          }}
                        >
                          <Sparkles size={16} />
                        </motion.div>

                        <motion.div
                          className="absolute -bottom-2 -left-2 text-pink-400"
                          animate={{
                            rotate: [360, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                            scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 },
                          }}
                        >
                          <Star size={12} />
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Premium Education Card */}
                    <motion.div 
                      className="flex-1 relative" 
                      whileHover={{ y: -8, scale: 1.02 }} 
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <motion.div
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/30 dark:border-gray-700/30 relative overflow-hidden group-hover:shadow-3xl"
                        whileHover={{
                          boxShadow: [
                            "0 25px 50px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)",
                            "0 35px 70px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(139, 92, 246, 0.2)",
                          ],
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Premium card background effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-purple-50/60 dark:from-blue-900/20 dark:to-purple-900/20" />
                        
                        {/* Animated background pattern */}
                        <motion.div
                          className="absolute inset-0 opacity-5"
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
                            `,
                          }}
                          animate={{
                            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                          }}
                          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Floating background icons */}
                        <motion.div
                          className="absolute top-6 right-6 text-blue-200/20 dark:text-blue-700/10"
                          animate={{ 
                            rotate: [0, 15, -15, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ 
                            duration: 8, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                        >
                          <BookOpen size={40} />
                        </motion.div>

                        <div className="relative z-10">
                          {/* Degree and Field with premium styling */}
                          <motion.h3
                            className="text-3xl font-bold mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.2 }}
                          >
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {edu.degree}
                            </span>
                            {edu.field && (
                              <span className="block text-xl text-gray-700 dark:text-gray-300 mt-1">
                                {edu.field}
                              </span>
                            )}
                          </motion.h3>

                          {/* School with premium styling */}
                          <motion.h4
                            className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.3 }}
                          >
                            {edu.school}
                          </motion.h4>

                          {/* Premium Date and Location Tags */}
                          <motion.div
                            className="flex flex-wrap gap-4 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.4 }}
                          >
                            <motion.div 
                              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-700/30 shadow-lg"
                              whileHover={{ scale: 1.05, y: -2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                                {formatDate(edu.start_date)} - {edu.current ? 'Devam ediyor' : (edu.end_date ? formatDate(edu.end_date) : '')}
                              </span>
                            </motion.div>
                            
                            <motion.div 
                              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 backdrop-blur-sm rounded-2xl border border-purple-200/50 dark:border-purple-700/30 shadow-lg"
                              whileHover={{ scale: 1.05, y: -2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <MapPin size={20} className="text-purple-600 dark:text-purple-400" />
                              <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                                {edu.location}
                              </span>
                            </motion.div>
                          </motion.div>

                          {/* Description with premium styling */}
                          <motion.div
                            className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.5 }}
                          >
                            {edu.description}
                          </motion.div>

                          {/* Premium Achievements Section */}
                          {edu.achievements && edu.achievements.length > 0 && (
                            <motion.div
                              className="space-y-6"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.2 + 0.6 }}
                            >
                              <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                  className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Award size={24} className="text-yellow-600 dark:text-yellow-400" />
                                </motion.div>
                                <h5 className="text-2xl font-bold text-gray-900 dark:text-white">
                                  Başarılar
                                </h5>
                              </div>
                              
                              <div className="grid gap-4">
                                {edu.achievements.map((achievement, i) => (
                                  <motion.div
                                    key={i}
                                    className="flex items-start gap-4 p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-700/30 shadow-lg backdrop-blur-sm"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 + 0.7 + i * 0.1 }}
                                    whileHover={{ 
                                      scale: 1.03, 
                                      y: -3,
                                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
                                    }}
                                  >
                                    <motion.div
                                      animate={{ 
                                        rotate: [0, 360],
                                        scale: [1, 1.2, 1],
                                      }}
                                      transition={{ 
                                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                      }}
                                    >
                                      <Star size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                                    </motion.div>
                                    <span className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                                      {achievement}
                                    </span>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-24"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="w-40 h-40 mx-auto mb-12 rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/30"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <GraduationCap className="w-20 h-20 text-blue-500 dark:text-blue-400" />
                  </motion.div>
                  <p className="text-2xl text-gray-600 dark:text-gray-400 font-medium">
                    Henüz eğitim bilgisi eklenmemiş.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationTimeline;
  
