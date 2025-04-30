import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

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

const AdminFooter = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    linkIndex: number;
  }>({
    isOpen: false,
    linkIndex: -1
  });

  useEffect(() => {
    fetchSettings();
  }, []);

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
      toast.error('Footer ayarları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSocialLinkChange = (
    platform: 'github' | 'linkedin' | 'twitter',
    value: string
  ) => {
    setSettings(prev => prev ? {
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    } : null);
  };

  const addNavigationLink = () => {
    setSettings(prev => prev ? {
      ...prev,
      navigation_links: [
        ...prev.navigation_links,
        { label: '', url: '' }
      ]
    } : null);
  };

  const updateNavigationLink = (index: number, field: 'label' | 'url', value: string) => {
    setSettings(prev => {
      if (!prev) return null;
      const newLinks = [...prev.navigation_links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, navigation_links: newLinks };
    });
  };

  const confirmDeleteLink = (index: number) => {
    setDeleteConfirm({
      isOpen: true,
      linkIndex: index
    });
  };

  const deleteNavigationLink = () => {
    const { linkIndex } = deleteConfirm;
    setSettings(prev => {
      if (!prev) return null;
      const newLinks = prev.navigation_links.filter((_, i) => i !== linkIndex);
      return { ...prev, navigation_links: newLinks };
    });
    setDeleteConfirm({ isOpen: false, linkIndex: -1 });
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('footer_settings')
        .upsert([settings]);

      if (error) throw error;
      toast.success('Footer ayarları başarıyla kaydedildi');
    } catch (error) {
      console.error('Footer ayarları kaydedilemedi:', error);
      toast.error('Footer ayarları kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Footer Yönetimi
        </h1>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn-primary"
        >
          <Save size={18} className="mr-2" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Hakkında Metni
          </h2>
          <textarea
            name="about_text"
            value={settings?.about_text || ''}
            onChange={handleInputChange}
            rows={4}
            className="form-input"
            placeholder="Footer hakkında metni..."
          />
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            İletişim Bilgileri
          </h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Adres</label>
              <input
                type="text"
                name="contact_address"
                value={settings?.contact_address || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="İstanbul, Türkiye"
              />
            </div>
            <div>
              <label className="form-label">E-posta</label>
              <input
                type="email"
                name="contact_email"
                value={settings?.contact_email || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="info@example.com"
              />
            </div>
            <div>
              <label className="form-label">Telefon</label>
              <input
                type="tel"
                name="contact_phone"
                value={settings?.contact_phone || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="+90 555 123 4567"
              />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sosyal Medya Bağlantıları
          </h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">GitHub</label>
              <input
                type="url"
                value={settings?.social_links.github || ''}
                onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                className="form-input"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="form-label">LinkedIn</label>
              <input
                type="url"
                value={settings?.social_links.linkedin || ''}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                className="form-input"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="form-label">Twitter</label>
              <input
                type="url"
                value={settings?.social_links.twitter || ''}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                className="form-input"
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Footer Bağlantıları
            </h2>
            <button
              onClick={addNavigationLink}
              className="btn-outline py-1 px-3 text-sm"
            >
              <Plus size={16} className="mr-1 inline-block" />
              Yeni Bağlantı
            </button>
          </div>

          <div className="space-y-4">
            {settings?.navigation_links.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Henüz footer bağlantısı eklenmemiş.</p>
                <p className="text-sm">Yeni bir bağlantı eklemek için "Yeni Bağlantı" butonuna tıklayın.</p>
              </div>
            ) : (
              settings?.navigation_links.map((link, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateNavigationLink(index, 'label', e.target.value)}
                      className="form-input mb-2"
                      placeholder="Bağlantı Etiketi"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateNavigationLink(index, 'url', e.target.value)}
                      className="form-input"
                      placeholder="Bağlantı URL"
                    />
                  </div>
                  <button
                    onClick={() => confirmDeleteLink(index)}
                    className="mt-2 p-2 text-gray-600 dark:text-gray-300 hover:text-error-600 dark:hover:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Copyright & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Telif Hakkı ve CTA
          </h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Telif Hakkı Metni</label>
              <input
                type="text"
                name="copyright_text"
                value={settings?.copyright_text || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="© 2024 Şirket Adı. Tüm hakları saklıdır."
              />
            </div>
            <div>
              <label className="form-label">CTA Metni (Opsiyonel)</label>
              <input
                type="text"
                name="cta_text"
                value={settings?.cta_text || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Hemen İletişime Geçin!"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Bağlantıyı Sil"
        message="Bu footer bağlantısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        onConfirm={deleteNavigationLink}
        onCancel={() => setDeleteConfirm({ isOpen: false, linkIndex: -1 })}
      />
    </div>
  );
};

export default AdminFooter;