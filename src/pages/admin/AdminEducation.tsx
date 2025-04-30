import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, GraduationCap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import type { Database } from '../../lib/database.types';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

type Education = Database['public']['Tables']['education']['Row'];
type EducationInput = Database['public']['Tables']['education']['Insert'];

const AdminEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    educationId: number | null;
    schoolName: string;
  }>({
    isOpen: false,
    educationId: null,
    schoolName: ''
  });

  const [formData, setFormData] = useState<EducationInput>({
    school: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: null,
    current: false,
    location: '',
    description: '',
    achievements: [],
    order_number: 0
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      setEducation(data || []);
    } catch (error) {
      console.error('Eğitim bilgileri çekilemedi:', error);
      toast.error('Eğitim bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (edu?: Education) => {
    if (edu) {
      setEditingEducation(edu);
      setFormData({
        school: edu.school,
        degree: edu.degree,
        field: edu.field,
        start_date: edu.start_date,
        end_date: edu.end_date,
        current: edu.current,
        location: edu.location,
        description: edu.description,
        achievements: edu.achievements,
        order_number: edu.order_number
      });
    } else {
      setEditingEducation(null);
      setFormData({
        school: '',
        degree: '',
        field: '',
        start_date: '',
        end_date: null,
        current: false,
        location: '',
        description: '',
        achievements: [],
        order_number: education.length
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name === 'current' && type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        current: checked,
        end_date: checked ? null : prev.end_date
      }));
      return;
    }

    if (name === 'end_date') {
      setFormData(prev => ({
        ...prev,
        [name]: value || null
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAchievementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const achievements = e.target.value.split('\n').filter(achievement => achievement.trim() !== '');
    setFormData(prev => ({
      ...prev,
      achievements
    }));
  };

  const saveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required start_date
      if (!formData.start_date) {
        toast.error('Başlangıç tarihi zorunludur');
        return;
      }

      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        end_date: formData.current ? null : (formData.end_date || null),
        order_number: editingEducation ? formData.order_number : education.length
      };

      if (editingEducation) {
        const { error } = await supabase
          .from('education')
          .update(dataToSubmit)
          .eq('id', editingEducation.id);
        
        if (error) throw error;
        toast.success('Eğitim bilgisi başarıyla güncellendi');
      } else {
        const { error } = await supabase
          .from('education')
          .insert([dataToSubmit]);
        
        if (error) throw error;
        toast.success('Yeni eğitim bilgisi başarıyla eklendi');
      }
      
      closeModal();
      fetchEducation();
    } catch (error) {
      console.error('Eğitim bilgisi kaydedilemedi:', error);
      toast.error('Eğitim bilgisi kaydedilirken bir hata oluştu');
    }
  };

  const confirmDelete = (edu: Education) => {
    setDeleteConfirm({
      isOpen: true,
      educationId: edu.id,
      schoolName: edu.school
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.educationId) return;
    
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', deleteConfirm.educationId);
      
      if (error) throw error;
      
      toast.success('Eğitim bilgisi başarıyla silindi');
      fetchEducation();
    } catch (error) {
      console.error('Eğitim bilgisi silinemedi:', error);
      toast.error('Eğitim bilgisi silinirken bir hata oluştu');
    } finally {
      setDeleteConfirm({ isOpen: false, educationId: null, schoolName: '' });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Eğitim Bilgileri
        </h1>
        <button 
          onClick={() => openModal()}
          className="btn-primary inline-flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Yeni Eğitim
        </button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {education.length > 0 ? (
            education.map(edu => (
              <div key={edu.id} className="card p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                    <GraduationCap size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {edu.degree} - {edu.field}
                    </h3>
                    <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
                      {edu.school}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {formatDate(edu.start_date)} - {edu.current ? 'Devam ediyor' : (edu.end_date ? formatDate(edu.end_date) : '')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {edu.location}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {edu.description}
                    </p>
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Başarılar:
                        </h5>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                          {edu.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal(edu)}
                        className="btn-outline py-1 px-3 text-sm"
                      >
                        <Edit size={16} className="mr-1 inline-block" />
                        Düzenle
                      </button>
                      <button 
                        onClick={() => confirmDelete(edu)}
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
                Henüz eğitim bilgisi eklenmemiş. Yeni bir eğitim eklemek için "Yeni Eğitim" butonuna tıklayın.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Education Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingEducation ? 'Eğitim Bilgisini Düzenle' : 'Yeni Eğitim Ekle'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={saveEducation} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="school" className="form-label">
                      Okul
                    </label>
                    <input
                      id="school"
                      name="school"
                      type="text"
                      required
                      value={formData.school}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Üniversite adı"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="form-label">
                      Konum
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Şehir, Ülke"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="degree" className="form-label">
                      Derece
                    </label>
                    <input
                      id="degree"
                      name="degree"
                      type="text"
                      required
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Lisans, Yüksek Lisans vb."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="field" className="form-label">
                      Alan
                    </label>
                    <input
                      id="field"
                      name="field"
                      type="text"
                      required
                      value={formData.field}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Bilgisayar Mühendisliği"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="start_date" className="form-label">
                      Başlangıç Tarihi
                    </label>
                    <input
                      id="start_date"
                      name="start_date"
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="end_date" className="form-label">
                      Bitiş Tarihi
                    </label>
                    <input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={formData.end_date || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      disabled={formData.current}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="current"
                    name="current"
                    type="checkbox"
                    checked={formData.current}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="current" className="ml-2 text-gray-700 dark:text-gray-300">
                    Halen devam ediyor
                  </label>
                </div>

                <div>
                  <label htmlFor="description" className="form-label">
                    Açıklama
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Eğitim sürecinde edinilen deneyimler..."
                  />
                </div>

                <div>
                  <label htmlFor="achievements" className="form-label">
                    Başarılar (Her satıra bir başarı)
                  </label>
                  <textarea
                    id="achievements"
                    name="achievements"
                    rows={4}
                    value={formData.achievements.join('\n')}
                    onChange={handleAchievementsChange}
                    className="form-input"
                    placeholder="Bölüm birinciliği&#10;3.85 GPA&#10;Akademik başarı bursu"
                  />
                </div>

                <div className="flex justify-end space-x-3">
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
                    {editingEducation ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Eğitim Bilgisini Sil"
        message={`"${deleteConfirm.schoolName}" eğitim bilgisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, educationId: null, schoolName: '' })}
      />
    </div>
  );
};

export default AdminEducation;