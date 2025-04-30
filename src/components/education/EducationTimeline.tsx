import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Education = Database['public']['Tables']['education']['Row'];

const EducationTimeline = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Format date to Turkish locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  return (
    <section className="py-16">
      <div className="container-custom">
        {loading ? (
          <div className="space-y-12 max-w-3xl mx-auto">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex animate-pulse">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-8"></div>
                <div className="flex-1 pt-1 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 h-full w-0.5 bg-primary-200 dark:bg-primary-800" />
              
              {/* Education items */}
              <div className="space-y-16">
                {education.length > 0 ? (
                  education.map((edu, index) => (
                    <motion.div 
                      key={edu.id} 
                      className="relative flex"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      {/* Circle */}
                      <div className="flex-shrink-0 z-10">
                        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-md mr-8">
                          <GraduationCap className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {edu.degree} - {edu.field}
                        </h3>
                        <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                          {edu.school}
                        </h4>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1" />
                            <span>
                              {formatDate(edu.start_date)} - {edu.current ? 'Devam ediyor' : (edu.end_date ? formatDate(edu.end_date) : '')}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-1" />
                            <span>{edu.location}</span>
                          </div>
                        </div>
                        
                        <div className="text-gray-700 dark:text-gray-300 mb-4">
                          {edu.description}
                        </div>
                        
                        {edu.achievements && edu.achievements.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                              <Award size={16} className="mr-2" />
                              Başarılar
                            </h5>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                              {edu.achievements.map((achievement, i) => (
                                <li key={i}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      Henüz eğitim bilgisi eklenmemiş.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EducationTimeline;