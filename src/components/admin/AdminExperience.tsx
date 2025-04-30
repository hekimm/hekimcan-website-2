import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import type { Database } from '../../lib/database.types';

type Deneyim = Database['public']['Tables']['deneyimler']['Row'];
type DeneyimInput = Database['public']['Tables']['deneyimler']['Insert'];

const AdminExperience = () => {
  const [experiences, setExperiences] = useState<Deneyim[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Deneyim | null>(null);
  const [formData, setFormData] = useState<DeneyimInput>({
    sirket_adi: '',
    pozisyon: '',
    baslangic_tarihi: '',
    bitis_tarihi: '',
    devam_ediyor: false,
    sorumluluklar: '',
    teknolojiler: []
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deneyimler')
        .select('*')
        .order('baslangic_tarihi', { ascending: false });
      
      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Deneyimler çekilemedi:', error);
      toast.error('Deneyimler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (experience?: Deneyim) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        sirket_adi: experience.sirket_adi,
        pozisyon: experience.pozisyon,
        baslangic_tarihi: experience.baslangic_tarihi,
        bitis_tarihi: experience.bitis_tarihi || '',
        devam_ediyor: experience.devam_ediyor,
        sorumluluklar: experience.sorumluluklar,
        teknolojiler: experience.teknolojiler
      });
    } else {
      setEditingExperience(null);
      setFormData({
        sirket_adi: '',
        pozisyon: '',
        baslangic_tarihi: '',
        bitis_tarihi: '',
        devam_ediyor: false,
        sorumluluklar: '',
        teknolojiler: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: val
    }));
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const techs = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    setFormData((prev) => ({
      ...prev,
      teknolojiler: techs
    }));
  };

  const saveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSave = { ...formData };
    if (dataToSave.devam_ediyor) {
      dataToSave.bitis_tarihi = null;
    }
    
    try {
      if (editingExperience) {
        // Mevcut deneyimi güncelle
        const { error } = await supabase
          .from('deneyimler')
          .update(dataToSave)
          .eq('id', editingExperience.id);
        
        if (error) throw error;
        toast.success('Deneyim başarıyla güncellendi');
      } else {
        // Yeni deneyim ekle
        const { error } = await supabase
          .from('deneyimler')
          .insert([dataToSave]);
        
        if (error) throw error;
        toast.success('Yeni deneyim başarıyla eklendi');
      }
      
      closeModal();
      fetchExperiences();
    } catch (error) {
      console.error('Deneyim kaydedilemedi:', error);
      toast.error('Deneyim kaydedilirken bir hata oluştu');
    }
  };

  const deleteExperience = async (id: number) => {
    if (!window.confirm('Bu deneyimi silmek istediğinizden emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('deneyimler')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Deneyim başarıyla silindi');
      fetchExperiences();
    } catch (error) {
      console.error('Deneyim silinemedi:', error);
      toast.error('Deneyim silinirken bir hata oluştu');
    }
  };

  // Tarih formatını düzenle: YYYY-MM-DD -> Ay Yıl
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const months = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Deneyimler
        </h1>
        <button 
          onClick={() => openModal()}
          className="btn-primary inline-flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Yeni Deneyim
        </button>
      </div>
      
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-start">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.length > 0 ? (
            experiences.map(experience => (
              <div key={experience.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                    <span className="text-lg font-bold">
                      {experience.sirket_adi.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {experience.pozisyon}
                    </h3>
                    <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-1">
                      {experience.sirket_adi}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {formatDate(experience.baslangic_tarihi)} - {experience.devam_ediyor ? 'Günümüz' : formatDate(experience.bitis_tarihi)}
                    </p>
                    
                    <div className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-line">
                      {experience.sorumluluklar}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {experience.teknolojiler.map((tech, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal(experience)}
                        className="btn-outline py-1 px-3 text-sm"
                      >
                        <Edit size={16} className="mr-1 inline-block" />
                        Düzenle
                      </button>
                      <button 
                        onClick={() => deleteExperience(experience.id)}
                        className="py-1 px-3 text-sm border border-error-300 text-error-700 hover:bg-error-50 dark:border-error-700 dark:text-error-400 dark:hover:bg-error-900/20 rounded-md transition-colors"
                      >
                        <Trash2 size={16} className="mr-1 inline-block" />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Henüz deneyim eklenmemiş. Yeni bir deneyim eklemek için "Yeni Deneyim" butonuna tıklayın.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Deneyim Ekleme/Düzenleme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingExperience ? 'Deneyimi Düzenle' : 'Yeni Deneyim Ekle'}
              </h2>
              
              <form onSubmit={saveExperience}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="sirket_adi" className="form-label">
                      Şirket Adı
                    </label>
                    <input
                      id="sirket_adi"
                      name="sirket_adi"
                      type="text"
                      required
                      value={formData.sirket_adi}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pozisyon" className="form-label">
                      Pozisyon
                    </label>
                    <input
                      id="pozisyon"
                      name="pozisyon"
                      type="text"
                      required
                      value={formData.pozisyon}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="baslangic_tarihi" className="form-label">
                        Başlangıç Tarihi
                      </label>
                      <input
                        id="baslangic_tarihi"
                        name="baslangic_tarihi"
                        type="date"
                        required
                        value={formData.baslangic_tarihi}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bitis_tarihi" className="form-label">
                        Bitiş Tarihi
                      </label>
                      <input
                        id="bitis_tarihi"
                        name="bitis_tarihi"
                        type="date"
                        value={formData.bitis_tarihi || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={formData.devam_ediyor}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="devam_ediyor"
                      name="devam_ediyor"
                      type="checkbox"
                      checked={formData.devam_ediyor}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="devam_ediyor" className="ml-2 text-gray-700 dark:text-gray-300">
                      Halen bu işte çalışıyorum
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="sorumluluklar" className="form-label">
                      Sorumluluklar
                    </label>
                    <textarea
                      id="sorumluluklar"
                      name="sorumluluklar"
                      required
                      rows={5}
                      value={formData.sorumluluklar}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Projelerin tasarımı ve geliştirilmesi..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="teknolojiler" className="form-label">
                      Teknolojiler (virgülle ayırarak)
                    </label>
                    <textarea
                      id="teknolojiler"
                      name="teknolojiler"
                      rows={2}
                      value={formData.teknolojiler.join(', ')}
                      onChange={handleTechnologiesChange}
                      className="form-input"
                      placeholder="React, Node.js, TypeScript"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-outline"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingExperience ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExperience;