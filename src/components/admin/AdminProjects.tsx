import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Upload, X, ExternalLink, Star, Github } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import type { Database } from '../../lib/database.types';
import ConfirmDialog from '../ui/ConfirmDialog';

type Proje = Database['public']['Tables']['projeler']['Row'];
type ProjeInput = Database['public']['Tables']['projeler']['Insert'];

const AdminProjects = () => {
  const [projects, setProjects] = useState<Proje[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Proje | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    projectId: number | null;
    projectName: string;
  }>({
    isOpen: false,
    projectId: null,
    projectName: ''
  });

  const [formData, setFormData] = useState<ProjeInput>({
    baslik: '',
    aciklama: '',
    gorsel_url: '',
    canli_demo_url: '',
    github_url: '',
    teknolojiler: [],
    one_cikan: false
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projeler')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Projeler çekilemedi:', error);
      toast.error('Projeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project?: Proje) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        baslik: project.baslik,
        aciklama: project.aciklama,
        gorsel_url: project.gorsel_url,
        canli_demo_url: project.canli_demo_url || '',
        github_url: project.github_url || '',
        teknolojiler: project.teknolojiler,
        one_cikan: project.one_cikan
      });
      setImagePreview(project.gorsel_url);
    } else {
      setEditingProject(null);
      setFormData({
        baslik: '',
        aciklama: '',
        gorsel_url: '',
        canli_demo_url: '',
        github_url: '',
        teknolojiler: [],
        one_cikan: false
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    if (name === 'gorsel_url') {
      setImagePreview(value);
    }
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const techs = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    setFormData((prev) => ({
      ...prev,
      teknolojiler: techs
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resim dosyası 5MB\'dan küçük olmalıdır');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        gorsel_url: publicUrl
      }));

      toast.success('Resim başarıyla yüklendi');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Resim yüklenirken bir hata oluştu');
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, gorsel_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projeler')
          .update(formData)
          .eq('id', editingProject.id);
        
        if (error) throw error;
        toast.success('Proje başarıyla güncellendi');
      } else {
        const { error } = await supabase
          .from('projeler')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Yeni proje başarıyla eklendi');
      }
      
      closeModal();
      fetchProjects();
    } catch (error) {
      console.error('Proje kaydedilemedi:', error);
      toast.error('Proje kaydedilirken bir hata oluştu');
    }
  };

  const confirmDelete = (project: Proje) => {
    setDeleteConfirm({
      isOpen: true,
      projectId: project.id,
      projectName: project.baslik
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.projectId) return;
    
    try {
      const { error } = await supabase
        .from('projeler')
        .delete()
        .eq('id', deleteConfirm.projectId);
      
      if (error) throw error;
      
      toast.success('Proje başarıyla silindi');
      fetchProjects();
    } catch (error) {
      console.error('Proje silinemedi:', error);
      toast.error('Proje silinirken bir hata oluştu');
    } finally {
      setDeleteConfirm({ isOpen: false, projectId: null, projectName: '' });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projeler
        </h1>
        <button 
          onClick={() => openModal()}
          className="btn-primary inline-flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Yeni Proje
        </button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {projects.length > 0 ? (
            projects.map(project => (
              <div key={project.id} className="card p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-full md:w-48 h-48 flex-shrink-0">
                    <div className="relative h-full w-full rounded-lg overflow-hidden">
                      <img 
                        src={project.gorsel_url} 
                        alt={project.baslik} 
                        className="w-full h-full object-cover"
                      />
                      {project.one_cikan && (
                        <div className="absolute top-2 left-2">
                          <div className="flex items-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Star size={12} className="text-yellow-500 mr-1" />
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              Öne Çıkan
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.baslik}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.aciklama}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.teknolojiler.map((tech, i) => (
                        <span 
                          key={i} 
                          className="px-2.5 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {project.canli_demo_url && (
                        <a 
                          href={project.canli_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                        >
                          <ExternalLink size={16} className="mr-1" />
                          Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a 
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                        >
                          <Github size={16} className="mr-1" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                    <button 
                      onClick={() => openModal(project)}
                      className="btn-outline py-1 px-3 text-sm"
                    >
                      <Edit size={16} className="mr-1 inline-block" />
                      Düzenle
                    </button>
                    <button 
                      onClick={() => confirmDelete(project)}
                      className="py-1 px-3 text-sm border border-error-300 text-error-700 hover:bg-error-50 dark:border-error-700 dark:text-error-400 dark:hover:bg-error-900/20 rounded-md transition-colors"
                    >
                      <Trash2 size={16} className="mr-1 inline-block" />
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Henüz proje eklenmemiş. Yeni bir proje eklemek için "Yeni Proje" butonuna tıklayın.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Project Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingProject ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
              </h2>
              
              <form onSubmit={saveProject}>
                <div className="space-y-6">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <label className="form-label">Proje Görseli</label>
                    
                    <div className="flex items-start space-x-4">
                      {/* Image Preview */}
                      <div className="relative">
                        {imagePreview ? (
                          <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                              src={imagePreview}
                              alt="Project Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={clearImagePreview}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-48 h-48 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
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
                          <label htmlFor="gorsel_url" className="form-label">
                            veya Resim URL'si
                          </label>
                          <input
                            id="gorsel_url"
                            name="gorsel_url"
                            type="url"
                            value={formData.gorsel_url}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="baslik" className="form-label">
                      Başlık
                    </label>
                    <input
                      id="baslik"
                      name="baslik"
                      type="text"
                      required
                      value={formData.baslik}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="aciklama" className="form-label">
                      Açıklama
                    </label>
                    <textarea
                      id="aciklama"
                      name="aciklama"
                      required
                      rows={4}
                      value={formData.aciklama}
                      onChange={handleInputChange}
                      className="form-input"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="teknolojiler" className="form-label">
                      Teknolojiler (virgülle ayırarak)
                    </label>
                    <textarea
                      id="teknolojiler"
                      name="teknolojiler"
                      required
                      rows={2}
                      value={formData.teknolojiler.join(', ')}
                      onChange={handleTechnologiesChange}
                      className="form-input"
                      placeholder="React Js, Node.js, MongoDB"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="canli_demo_url" className="form-label">
                        Canlı Demo URL (opsiyonel)
                      </label>
                      <input
                        id="canli_demo_url"
                        name="canli_demo_url"
                        type="url"
                        value={formData.canli_demo_url}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="github_url" className="form-label">
                        GitHub URL (opsiyonel)
                      </label>
                      <input
                        id="github_url"
                        name="github_url"
                        type="url"
                        value={formData.github_url}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="one_cikan"
                      name="one_cikan"
                      type="checkbox"
                      checked={formData.one_cikan}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="one_cikan" className="ml-2 text-gray-700 dark:text-gray-300">
                      Öne Çıkan Proje
                    </label>
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
                    {editingProject ? 'Güncelle' : 'Ekle'}
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
        title="Projeyi Sil"
        message={`"${deleteConfirm.projectName}" projesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, projectId: null, projectName: '' })}
      />
    </div>
  );
};

export default AdminProjects;