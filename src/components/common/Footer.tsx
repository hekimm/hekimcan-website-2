import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Twitter, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Hekimcan AKTAŞ
            </Link>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {loading ? (
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              ) : (
                settings?.about_text || 'Kıdemli Yazılım Geliştirici'
              )}
            </p>
            <div className="flex mt-4 space-x-4">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                ))
              ) : (
                <>
                  {settings?.social_links.github && (
                    <a 
                      href={settings.social_links.github}
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Github"
                      className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {settings?.social_links.linkedin && (
                    <a 
                      href={settings.social_links.linkedin}
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  {settings?.social_links.twitter && (
                    <a 
                      href={settings.social_links.twitter}
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Sayfalar
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Ana Sayfa
              </Link>
              <Link 
                to="/hakkimda" 
                className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Hakkımda
              </Link>
              <Link 
                to="/projeler" 
                className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Projeler
              </Link>
              <Link 
                to="/egitim" 
                className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Eğitim
              </Link>
              <Link 
                to="/iletisim" 
                className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
              >
                İletişim
              </Link>
              {loading ? (
                [...Array(2)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                ))
              ) : (
                settings?.navigation_links.map((link, index) => (
                  <Link 
                    key={index}
                    to={link.url} 
                    className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))
              )}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              İletişim
            </h3>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                ))}
              </div>
            ) : (
              <address className="not-italic text-gray-600 dark:text-gray-400 space-y-2">
                <p>{settings?.contact_address}</p>
                <p>
                  <a 
                    href={`mailto:${settings?.contact_email}`}
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {settings?.contact_email}
                  </a>
                </p>
                <p>
                  <a 
                    href={`tel:${settings?.contact_phone?.replace(/\s/g, '')}`}
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {settings?.contact_phone}
                  </a>
                </p>
              </address>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex justify-between items-center text-gray-600 dark:text-gray-400">
          <p>
            {loading ? (
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
            ) : (
              settings?.copyright_text || '© 2024 Hekimcan AKTAŞ. Tüm hakları saklıdır.'
            )}
          </p>
          <Link 
            to="/admin/giris" 
            className="flex items-center text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <Lock size={16} className="mr-1" />
            <span className="text-sm">Admin Girişi</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;