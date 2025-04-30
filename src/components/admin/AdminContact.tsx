import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface ContactInfo {
  id: number;
  contact_address: string;
  contact_email: string;
  contact_phone: string;
}

const AdminContact = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contact_address: '',
    contact_email: '',
    contact_phone: ''
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('id, contact_address, contact_email, contact_phone')
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          contact_address: data.contact_address || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || ''
        });
      }
    } catch (error) {
      console.error('İletişim bilgileri yüklenemedi:', error);
      toast.error('İletişim bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('footer_settings')
        .update(formData)
        .eq('id', 1);

      if (error) throw error;

      toast.success('İletişim bilgileri başarıyla güncellendi');
    } catch (error) {
      console.error('İletişim bilgileri güncellenemedi:', error);
      toast.error('İletişim bilgileri güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
          İletişim Bilgileri
        </h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary"
        >
          <Save size={18} className="mr-2" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="contact_address" className="form-label">
                Adres
              </label>
              <input
                id="contact_address"
                name="contact_address"
                type="text"
                value={formData.contact_address}
                onChange={handleInputChange}
                className="form-input"
                placeholder="İstanbul, Türkiye"
              />
            </div>

            <div>
              <label htmlFor="contact_email" className="form-label">
                E-posta
              </label>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="info@example.com"
              />
            </div>

            <div>
              <label htmlFor="contact_phone" className="form-label">
                Telefon
              </label>
              <input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="+90 555 123 4567"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminContact;