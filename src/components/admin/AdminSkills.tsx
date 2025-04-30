import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { 
  Plus, 
  Save, 
  Trash2, 
  X, 
  Edit2, 
  Image as ImageIcon,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import ConfirmDialog from '../ui/ConfirmDialog';

interface Skill {
  id: number;
  isim: string;
  aciklama: string;
  ikon_url: string;
  kategori: string;
}

const CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
  'Mobile',
  'Cloud',
  'Testing'
];

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    isim: '',
    aciklama: '',
    ikon_url: '',
    kategori: CATEGORIES[0]
  });
  const [iconPreviewError, setIconPreviewError] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    skillId: number | null;
    skillName: string;
  }>({
    isOpen: false,
    skillId: null,
    skillName: ''
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('yetenekler')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Yetenekler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        isim: skill.isim,
        aciklama: skill.aciklama,
        ikon_url: skill.ikon_url,
        kategori: skill.kategori
      });
    } else {
      setEditingSkill(null);
      setFormData({
        isim: '',
        aciklama: '',
        ikon_url: '',
        kategori: CATEGORIES[0]
      });
    }
    setIsModalOpen(true);
    setIconPreviewError(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setIconPreviewError(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Reset icon preview error when URL changes
    if (name === 'ikon_url') {
      setIconPreviewError(false);
    }
  };

  const handleIconError = () => {
    setIconPreviewError(true);
  };

  const validateForm = () => {
    if (!formData.isim.trim()) {
      toast.error('Yetenek ismi gereklidir');
      return false;
    }
    if (!formData.aciklama.trim()) {
      toast.error('Açıklama gereklidir');
      return false;
    }
    if (!formData.ikon_url.trim()) {
      toast.error('İkon URL gereklidir');
      return false;
    }
    if (iconPreviewError) {
      toast.error('Geçerli bir ikon URL\'si giriniz');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingSkill) {
        const { error } = await supabase
          .from('yetenekler')
          .update(formData)
          .eq('id', editingSkill.id);
        
        if (error) throw error;
        
        setSkills(prev => 
          prev.map(skill => 
            skill.id === editingSkill.id ? { ...skill, ...formData } : skill
          )
        );
        
        toast.success('Yetenek başarıyla güncellendi');
      } else {
        const { data, error } = await supabase
          .from('yetenekler')
          .insert([formData])
          .select();
        
        if (error) throw error;
        
        if (data) {
          setSkills(prev => [data[0], ...prev]);
        }
        
        toast.success('Yeni yetenek başarıyla eklendi');
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving skill:', error);
      toast.error('Yetenek kaydedilirken bir hata oluştu');
    }
  };

  const confirmDelete = (skill: Skill) => {
    setDeleteConfirm({
      isOpen: true,
      skillId: skill.id,
      skillName: skill.isim
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.skillId) return;
    
    try {
      const { error } = await supabase
        .from('yetenekler')
        .delete()
        .eq('id', deleteConfirm.skillId);
      
      if (error) throw error;
      
      setSkills(prev => prev.filter(skill => skill.id !== deleteConfirm.skillId));
      toast.success('Yetenek başarıyla silindi');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Yetenek silinirken bir hata oluştu');
    } finally {
      setDeleteConfirm({ isOpen: false, skillId: null, skillName: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Yetenekler
        </h2>
        <button 
          onClick={() => openModal()}
          className="btn-primary inline-flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Yeni Yetenek
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(skill => (
            <div 
              key={skill.id} 
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mr-4">
                  <img
                    src={skill.ikon_url}
                    alt={skill.isim}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {skill.isim}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {skill.aciklama}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                    {skill.kategori}
                  </span>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => openModal(skill)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => confirmDelete(skill)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-error-600 dark:hover:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingSkill ? 'Yeteneği Düzenle' : 'Yeni Yetenek Ekle'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="isim" className="form-label">
                      Yetenek İsmi
                    </label>
                    <input
                      id="isim"
                      name="isim"
                      type="text"
                      value={formData.isim}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="React"
                    />
                  </div>

                  <div>
                    <label htmlFor="kategori" className="form-label">
                      Kategori
                    </label>
                    <select
                      id="kategori"
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="aciklama" className="form-label">
                    Açıklama
                  </label>
                  <textarea
                    id="aciklama"
                    name="aciklama"
                    value={formData.aciklama}
                    onChange={handleInputChange}
                    className="form-input"
                    rows={3}
                    placeholder="Modern web uygulamaları geliştirme"
                  />
                </div>

                <div>
                  <label htmlFor="ikon_url" className="form-label flex items-center justify-between">
                    <span>İkon URL</span>
                    <a 
                      href="https://devicon.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center"
                    >
                      <span>İkon Bul</span>
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        id="ikon_url"
                        name="ikon_url"
                        type="url"
                        value={formData.ikon_url}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                      />
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {formData.ikon_url ? (
                        iconPreviewError ? (
                          <AlertCircle className="w-6 h-6 text-error-500" />
                        ) : (
                          <img
                            src={formData.ikon_url}
                            alt="Icon Preview"
                            className="w-8 h-8 object-contain"
                            onError={handleIconError}
                          />
                        )
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {iconPreviewError && (
                    <p className="mt-1 text-sm text-error-500">
                      İkon yüklenemedi. Lütfen URL'yi kontrol edin.
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-6">
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
                    <Save size={18} className="mr-2" />
                    {editingSkill ? 'Güncelle' : 'Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Yeteneği Sil"
        message={`"${deleteConfirm.skillName}" yeteneğini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, skillId: null, skillName: '' })}
      />
    </div>
  );
};

export default AdminSkills;