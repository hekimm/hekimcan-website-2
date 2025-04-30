import { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ContactInfo {
  contact_address: string;
  contact_email: string;
  contact_phone: string;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const ContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('footer_settings')
          .select('contact_address, contact_email, contact_phone, social_links')
          .limit(1)
          .single();

        if (error) throw error;
        setContactInfo(data);
      } catch (error) {
        console.error('İletişim bilgileri yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) {
    return (
      <div className="card p-6 md:p-8 animate-pulse">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        İletişim Bilgileri
      </h3>
      
      <ul className="space-y-6">
        <li className="flex">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
            <Mail size={20} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              E-posta
            </h4>
            <a 
              href={`mailto:${contactInfo?.contact_email}`} 
              className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {contactInfo?.contact_email}
            </a>
          </div>
        </li>
        
        <li className="flex">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
            <Phone size={20} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Telefon
            </h4>
            <a 
              href={`tel:${contactInfo?.contact_phone?.replace(/\s/g, '')}`} 
              className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {contactInfo?.contact_phone}
            </a>
          </div>
        </li>
        
        <li className="flex">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
            <MapPin size={20} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Konum
            </h4>
            <p className="text-gray-900 dark:text-white">
              {contactInfo?.contact_address}
            </p>
          </div>
        </li>
      </ul>
      
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Sosyal Medya
        </h4>
        <div className="flex space-x-4">
          {contactInfo?.social_links?.github && (
            <a 
              href={contactInfo.social_links.github}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Github"
            >
              <Github size={20} />
            </a>
          )}
          {contactInfo?.social_links?.linkedin && (
            <a 
              href={contactInfo.social_links.linkedin}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          )}
          {contactInfo?.social_links?.twitter && (
            <a 
              href={contactInfo.social_links.twitter}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;