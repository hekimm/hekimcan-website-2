import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Save, Upload, X } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Profile = Database['public']['Tables']['profil']['Row'];

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    isim: '',
    unvan: '',
    slogan: '',
    hakkimda: '',
    resim_url: '',
    email: '',
    konum: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profil')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          isim: data.isim || '',
          unvan: data.unvan || '',
          slogan: data.slogan || '',
          hakkimda: data.hakkimda || '',
          resim_url: data.resim_url || '',
          email: data.email || '',
          konum: data.konum || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          twitter_url: data.twitter_url || ''
        });
        setImagePreview(data.resim_url || null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Profil bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update image preview when URL changes
    if (name === 'resim_url') {
      setImagePreview(value);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resim dosyası 5MB\'dan küçük olmalıdır');
      return;
    }

    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Update form data with new image URL
      setFormData(prev => ({
        ...prev,
        resim_url: publicUrl
      }));

      toast.success('Resim başarıyla yüklendi');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Resim yüklenirken bir hata oluştu');
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, resim_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let result;
      
      if (profile) {
        // Update existing profile
        result = await supabase
          .from('profil')
          .update(formData)
          .eq('id', profile.id);
      } else {
        // Insert new profile
        result = await supabase
          .from('profil')
          .insert([formData]);
      }

      if (result.error) throw result.error;

      toast.success('Profil başarıyla kaydedildi');
      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Profil kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Profil Yönetimi
      </h2>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <label className="form-label">Profil Fotoğrafı</label>
          
          <div className="flex items-start space-x-4">
            {/* Image Preview */}
            <div className="relative">
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImagePreview}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Upload size={24} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-4">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-outline py-2 px-4"
                >
                  <Upload size={18} className="mr-2 inline-block" />
                  Resim Yükle
                </button>
              </div>

              <div>
                <label htmlFor="resim_url" className="form-label">
                  veya Resim URL'si
                </label>
                <input
                  id="resim_url"
                  name="resim_url"
                  type="url"
                  value={formData.resim_url}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="isim" className="form-label">
              İsim Soyisim
            </label>
            <input
              id="isim"
              name="isim"
              type="text"
              required
              value={formData.isim}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Hekimcan AKTAŞ"
            />
          </div>

          <div>
            <label htmlFor="unvan" className="form-label">
              Ünvan
            </label>
            <input
              id="unvan"
              name="unvan"
              type="text"
              required
              value={formData.unvan}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Kıdemli Yazılım Geliştirici"
            />
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="konum" className="form-label">
              Konum
            </label>
            <input
              id="konum"
              name="konum"
              type="text"
              value={formData.konum}
              onChange={handleInputChange}
              className="form-input"
              placeholder="İstanbul, Türkiye"
            />
          </div>
        </div>

        <div>
          <label htmlFor="slogan" className="form-label">
            Slogan
          </label>
          <input
            id="slogan"
            name="slogan"
            type="text"
            required
            value={formData.slogan}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Modern web teknolojileri ile yenilikçi çözümler"
          />
        </div>

        <div>
          <label htmlFor="hakkimda" className="form-label">
            Hakkımda
          </label>
          <textarea
            id="hakkimda"
            name="hakkimda"
            required
            rows={5}
            value={formData.hakkimda}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Kendinizi tanıtan bir metin yazın..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="linkedin_url" className="form-label">
              LinkedIn URL
            </label>
            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              value={formData.linkedin_url}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label htmlFor="github_url" className="form-label">
              GitHub URL
            </label>
            <input
              id="github_url"
              name="github_url"
              type="url"
              value={formData.github_url}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label htmlFor="twitter_url" className="form-label">
              Twitter URL
            </label>
            <input
              id="twitter_url"
              name="twitter_url"
              type="url"
              value={formData.twitter_url}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center space-x-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Kaydet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;