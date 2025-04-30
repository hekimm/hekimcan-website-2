import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  User, 
  Briefcase, 
  MessageSquare, 
  ArrowUpRight, 
  Activity,
  Database,
  Terminal,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  GraduationCap,
  Award,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0,
    unreadMessages: 0,
    featuredProjects: 0,
    activeCodeSnippets: 0,
    totalViews: Math.floor(Math.random() * 1000) + 500, // Simulated view count
    education: 0,
    certifications: 0,
    currentEducation: 0,
    activeCertifications: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Projects count
        const { count: projectsCount } = await supabase
          .from('projeler')
          .select('*', { count: 'exact', head: true });
        
        // Featured projects count
        const { count: featuredCount } = await supabase
          .from('projeler')
          .select('*', { count: 'exact', head: true })
          .eq('one_cikan', true);

        // Skills count
        const { count: skillsCount } = await supabase
          .from('yetenekler')
          .select('*', { count: 'exact', head: true });
        
        // Active code snippets count
        const { count: snippetsCount } = await supabase
          .from('code_snippets')
          .select('*', { count: 'exact', head: true })
          .eq('active', true);
        
        // Messages counts
        const { count: messagesCount } = await supabase
          .from('iletisim')
          .select('*', { count: 'exact', head: true });
        
        const { count: unreadMessagesCount } = await supabase
          .from('iletisim')
          .select('*', { count: 'exact', head: true })
          .eq('okundu', false);

        // Education counts
        const { count: educationCount } = await supabase
          .from('education')
          .select('*', { count: 'exact', head: true });

        const { count: currentEducationCount } = await supabase
          .from('education')
          .select('*', { count: 'exact', head: true })
          .eq('current', true);

        // Certification counts
        const { count: certificationsCount } = await supabase
          .from('certifications')
          .select('*', { count: 'exact', head: true });
        
        setStats({
          projects: projectsCount || 0,
          skills: skillsCount || 0,
          messages: messagesCount || 0,
          unreadMessages: unreadMessagesCount || 0,
          featuredProjects: featuredCount || 0,
          activeCodeSnippets: snippetsCount || 0,
          totalViews: Math.floor(Math.random() * 1000) + 500,
          education: educationCount || 0,
          certifications: certificationsCount || 0,
          currentEducation: currentEducationCount || 0,
          activeCertifications: certificationsCount || 0
        });
      } catch (error) {
        console.error('İstatistikler alınırken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Toplam Projeler',
      count: stats.projects,
      icon: <Code2 size={24} />,
      color: 'bg-primary-500 dark:bg-primary-600',
      link: '/admin/projeler',
      metric: {
        label: 'Öne Çıkan',
        value: stats.featuredProjects,
        icon: <Star size={14} className="text-yellow-400" />
      }
    },
    {
      title: 'Yetenekler',
      count: stats.skills,
      icon: <Terminal size={24} />,
      color: 'bg-secondary-500 dark:bg-secondary-600',
      link: '/admin/yetenekler',
      metric: {
        label: 'Kategoriler',
        value: '4',
        icon: <Database size={14} />
      }
    },
    {
      title: 'Eğitim',
      count: stats.education,
      icon: <GraduationCap size={24} />,
      color: 'bg-accent-500 dark:bg-accent-600',
      link: '/admin/egitim',
      metric: {
        label: 'Devam Eden',
        value: stats.currentEducation,
        icon: <CheckCircle size={14} className="text-emerald-400" />
      }
    },
    {
      title: 'Sertifikalar',
      count: stats.certifications,
      icon: <Award size={24} />,
      color: 'bg-success-500 dark:bg-success-600',
      link: '/admin/sertifikalar',
      metric: {
        label: 'Aktif',
        value: stats.activeCertifications,
        icon: <CheckCircle size={14} className="text-emerald-400" />
      }
    },
    {
      title: 'Kod Snippetleri',
      count: stats.activeCodeSnippets,
      icon: <Code2 size={24} />,
      color: 'bg-warning-500 dark:bg-warning-600',
      link: '/admin/code-editor',
      metric: {
        label: 'Aktif',
        value: stats.activeCodeSnippets,
        icon: <CheckCircle size={14} className="text-emerald-400" />
      }
    },
    {
      title: 'Mesajlar',
      count: stats.messages,
      icon: <MessageSquare size={24} />,
      color: 'bg-error-500 dark:bg-error-600',
      link: '/admin/mesajlar',
      metric: {
        label: 'Okunmamış',
        value: stats.unreadMessages,
        icon: stats.unreadMessages > 0 
          ? <XCircle size={14} className="text-red-400" />
          : <CheckCircle size={14} className="text-emerald-400" />
      }
    }
  ];

  const quickActions = [
    {
      title: 'Yeni Proje Ekle',
      icon: <Code2 size={20} />,
      link: '/admin/projeler',
      color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
    },
    {
      title: 'Yetenek Ekle',
      icon: <User size={20} />,
      link: '/admin/yetenekler',
      color: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300'
    },
    {
      title: 'Eğitim Ekle',
      icon: <GraduationCap size={20} />,
      link: '/admin/egitim',
      color: 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
    },
    {
      title: 'Sertifika Ekle',
      icon: <Award size={20} />,
      link: '/admin/sertifikalar',
      color: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300'
    },
    {
      title: 'Kod Snippet Ekle',
      icon: <Terminal size={20} />,
      link: '/admin/code-editor',
      color: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Portfolyo yönetim paneline hoş geldiniz
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Activity size={16} className="text-emerald-500" />
            <span>Toplam Görüntülenme:</span>
            <span className="font-semibold">{stats.totalViews}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock size={16} />
            <span>Son güncelleme:</span>
            <span className="font-semibold">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Skeleton loading state
          [...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : (
          statCards.map((card, index) => (
            <Link 
              key={index}
              to={card.link}
              className="group"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Card Content */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <ArrowUpRight 
                    size={20} 
                    className="text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {card.title}
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {card.count}
                </div>
                
                {/* Metric */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  {card.metric.icon}
                  <span className="ml-2">{card.metric.label}:</span>
                  <span className="ml-1 font-semibold">{card.metric.value}</span>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-xl bg-primary-600/5 dark:bg-primary-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </Link>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Hızlı İşlemler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-gray-700 dark:text-gray-300">
                {action.title}
              </span>
              <ArrowUpRight 
                size={16} 
                className="ml-auto text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" 
              />
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sistem Durumu
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              <span className="text-gray-700 dark:text-gray-300">Supabase Bağlantısı</span>
            </div>
            <span className="text-sm text-emerald-600 dark:text-emerald-400">Aktif</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              <span className="text-gray-700 dark:text-gray-300">Storage Bucket</span>
            </div>
            <span className="text-sm text-emerald-600 dark:text-emerald-400">Aktif</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              <span className="text-gray-700 dark:text-gray-300">API Endpoint</span>
            </div>
            <span className="text-sm text-emerald-600 dark:text-emerald-400">Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;