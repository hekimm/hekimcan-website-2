import { useState, useEffect } from 'react';
import { ExternalLink, Github, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Proje = Database['public']['Tables']['projeler']['Row'];

const ProjectsGrid = () => {
  const [projects, setProjects] = useState<Proje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projeler')
          .select('*')
          .order('created_at', { ascending: false });
        
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12">
      <div className="container-custom">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-[450px] animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {projects.map((project) => (
                <motion.div 
                  key={project.id} 
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
                  variants={item}
                >
                  {/* Featured Badge */}
                  {project.one_cikan && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="flex items-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                        <Star size={14} className="text-yellow-500 mr-1.5" />
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          Öne Çıkan
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={project.gorsel_url} 
                      alt={project.baslik} 
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-6 w-full flex justify-between items-center">
                        {project.github_url && (
                          <a 
                            href={project.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-white hover:text-primary-300 transition-colors"
                            aria-label="GitHub"
                          >
                            <Github size={20} />
                          </a>
                        )}
                        {project.canli_demo_url && (
                          <a 
                            href={project.canli_demo_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-white hover:text-primary-300 transition-colors"
                            aria-label="Canlı Demo"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {project.baslik}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {project.aciklama}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.teknolojiler.map((tech, i) => (
                        <span 
                          key={i} 
                          className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {projects.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Henüz proje eklenmemiş.
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default ProjectsGrid;