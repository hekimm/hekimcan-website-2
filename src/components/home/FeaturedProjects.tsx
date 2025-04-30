import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Proje = Database['public']['Tables']['projeler']['Row'];

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Proje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projeler')
          .select('*')
          .eq('one_cikan', true)
          .order('created_at', { ascending: false })
          .limit(3);
        
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

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Öne Çıkan Projeler
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Son dönemde geliştirdiğim bazı projeler. Tüm projelerimi görmek için proje sayfasını ziyaret edebilirsiniz.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-96 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id} 
                  className="card group hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="h-48 relative overflow-hidden rounded-t-lg">
                    <img 
                      src={project.gorsel_url} 
                      alt={project.baslik} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full flex justify-between">
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
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.baslik}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.teknolojiler.slice(0, 3).map((tech, i) => (
                        <span 
                          key={i} 
                          className="text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-2 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.teknolojiler.length > 3 && (
                        <span className="text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-full">
                          +{project.teknolojiler.length - 3}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.aciklama}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {projects.length > 0 && (
              <div className="text-center mt-12">
                <Link 
                  to="/projeler" 
                  className="btn-outline inline-flex items-center space-x-2"
                >
                  <span>Tüm Projeleri Gör</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

            {projects.length === 0 && !loading && (
              <div className="text-center py-10">
                <p className="text-gray-600 dark:text-gray-400">
                  Henüz öne çıkan proje bulunmamaktadır.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;